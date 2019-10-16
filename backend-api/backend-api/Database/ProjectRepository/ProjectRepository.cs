using System;
using System.Collections.Generic;
using System.Linq;
using backend_api.Models;
using Neo4j.Driver.V1;
using Neo4jClient;

namespace backend_api.Database.ProjectRepository
{
    public class ProjectRepository : IProjectRepository
    {
        
        private readonly neo4jConnection _neo4jConnection;
        private readonly ISession _session;

        public ProjectRepository()
        {
            _neo4jConnection = new neo4jConnection();
            _session = _neo4jConnection.driver.Session();
        }
        
        public RepositoryReturn<IEnumerable<Project>> GetAllForUser(Guid personGuid)
        {
            try
            {   
                using (_session)
                {
                    var returnedProjects = _session.ReadTransaction(tx => RetrieveUserProjects(tx, personGuid));
                    
                    foreach (Project currentProject in returnedProjects)
                    {
                        var returnedTags = _session.ReadTransaction(tx => RetrieveProjectTags(tx, currentProject.Guid, currentProject.parentProjectGuid));
                        currentProject.tagList = returnedTags.ToList();
                        var returnedTasks = _session.ReadTransaction(tx => RetrieveProjectTasks(tx, currentProject.Guid));
                        currentProject.taskList = returnedTasks.ToList();
                    }
                    
                    return new RepositoryReturn<IEnumerable<Project>>(returnedProjects);
                }

            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<IEnumerable<Project>>(true, e);
            }
        }

        private List<Project> RetrieveUserProjects(ITransaction tx, Guid personGuid)
        {
            var personId = personGuid.ToString();
            var result = tx.Run("MATCH (person:Person) -- (project:Project) WHERE person.guid = $personId RETURN project", new { personId });

            var records = result.Select(record => new Project(record[0].As<INode>().Properties)).ToList();

            return records;
        }

        private Project RetrieveSingleUserProject(ITransaction tx, Guid projectGuid)
        {
            var projectId = projectGuid.ToString();
            var result = tx.Run("MATCH (project:Project) WHERE project.guid = $projectId RETURN project", new { projectId });

            var record = result.SingleOrDefault();
            if (record == null)
            {
                return null;
            }
            return new Project(record[0].As<INode>().Properties);
            
        }

        private List<Tag> RetrieveProjectTags(ITransaction tx, Guid projectGuid, Guid parentProjectGuid)
        {
            //If the project is a subproject then get the tags from its parent
            var projectId = parentProjectGuid.ToString().Equals("00000000-0000-0000-0000-000000000000") ? 
                projectGuid.ToString() 
                : parentProjectGuid.ToString();
            
            var query = "MATCH (project:Project) -- (tag:Tag) WHERE project.guid = $projectId RETURN tag";
            
            var result = tx.Run(query, 
                new { projectId });
            

            var records = result.Select(record => new Tag(record[0].As<INode>().Properties)).ToList();

            return records;
        }
        
        private List<ProjectTask> RetrieveProjectTasks(ITransaction tx, Guid projectGuid)
        {
            var projectId = projectGuid.ToString();
            var result = tx.Run("MATCH (project:Project) -- (projectTask:ProjectTask) WHERE project.guid = $projectId RETURN projectTask", new { projectId });

            var records = result.Select(record => new ProjectTask(record[0].As<INode>().Properties)).ToList();

            return records;
        }


        public RepositoryReturn<Project> GetByGuid(Guid projectGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    var returnedProject = session.ReadTransaction(tx => RetrieveSingleUserProject(tx, projectGuid));
                    
                    if (returnedProject == null)
                    {
                        return new RepositoryReturn<Project>(true, new ArgumentNullException());
                    }

                    var returnedTags = session.ReadTransaction(tx => RetrieveProjectTags(tx, projectGuid, returnedProject.parentProjectGuid));
                    returnedProject.tagList = returnedTags.ToList();
                    var returnedTasks = session.ReadTransaction(tx => RetrieveProjectTasks(tx, projectGuid));
                    returnedProject.taskList = returnedTasks.ToList();

                    return new RepositoryReturn<Project>(returnedProject);
                }

            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<Project>(true, e);
            }
        }

        public RepositoryReturn<bool> Add(Project projectToAdd, Guid userGuid)
        {
            
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    session.WriteTransaction(tx => CreateProjectNode(tx, projectToAdd));
                    session.WriteTransaction(tx => CreateProjectRelationship(tx, projectToAdd, userGuid));

                    session.WriteTransaction(tx => CreateTagNodes(tx, projectToAdd));
                    session.WriteTransaction(tx => CreateTagRelationships(tx, projectToAdd));

                    session.WriteTransaction(tx => CreateTaskNodes(tx, projectToAdd.taskList));
                    session.WriteTransaction(tx => CreateTaskRelationships(tx, projectToAdd.taskList, projectToAdd.Guid));
                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }
        
        private void CreateProjectNode(ITransaction tx, Project project)
        {
            string projectName = project.name;
            string projectDescription = project.description;
            string projectImageIndex = project.imageIndex.ToString();
            string projectGuid = project.Guid.ToString();
            tx.Run("CREATE(p:Project {name: $projectName, " +
                   "description: $projectDescription, " +
                   "imageIndex: $projectImageIndex, " +
                   "dateTimeCreated: localdatetime({ timezone: 'Pacific/Auckland' }), " +
                   "guid: $projectGuid})", 
                new { projectName, projectDescription, projectImageIndex, projectGuid });
        }

        private void CreateProjectRelationship(ITransaction tx, Project project, Guid userGuid)
        {
            //Create the relationship to the project
            string projectGuid = project.Guid.ToString();
            string typeString = "owner";
            string userId = userGuid.ToString();
            tx.Run("MATCH (p:Project),(pe:Person) WHERE p.guid = $projectGuid AND pe.guid = $userId CREATE (pe)-[:CONTRIBUTES_TO {type:[$typeString]}]->(p)", new { projectGuid, userId, typeString });


        }

        private void CreateTagNodes(ITransaction tx, Project project) {
            foreach(Tag tag in project.tagList)
            {
                //Add the tag node to the database
                string tagName = tag.name;
                tx.Run("MERGE(t:Tag {name: $tagName})", new { tagName });
            }

        }

        private void CreateTagRelationships(ITransaction tx, Project project)
        {
            foreach (Tag tag in project.tagList)
            {
                //Create the relationship to the project
                string projectGuid = project.Guid.ToString();
                string tagName = tag.name;
                tx.Run("MATCH (p:Project),(t:Tag) WHERE p.guid = $projectGuid AND t.name = $tagName CREATE (p)-[:HAS]->(t)", new { projectGuid, tagName});
            }

        }

        private void CreateTaskNodes(ITransaction tx, List<ProjectTask> taskList) {
            foreach (ProjectTask task in taskList)
            {
                //Add the tag node to the database
                string taskName = task.name;
                string taskGuid = task.Guid.ToString();
                bool completed = task.completed;
                int orderIndex = taskList.IndexOf(task);
                tx.Run("CREATE(pt:ProjectTask {name: $taskName, " +
                       "completed: $completed, " +
                       "orderIndex: $orderIndex, " +
                       "dateTimeCreated: localdatetime({ timezone: 'Pacific/Auckland' }), " +
                       "guid: $taskGuid})", 
                    new { taskName, completed, orderIndex, taskGuid });
            }
        }

        private void CreateTaskRelationships(ITransaction tx, List<ProjectTask> taskList, Guid projectGuid)
        {
            foreach (ProjectTask task in taskList)
            {
                //Create the relationship to the project
                string taskGuid = task.Guid.ToString();
                string projectId = projectGuid.ToString();
                tx.Run("MATCH (p:Project),(t:ProjectTask) WHERE p.guid = $projectId AND t.guid = $taskGuid CREATE (p)-[:HAS]->(t)", new { projectId, taskGuid});
            }
        }

        public RepositoryReturn<bool> EditTaskOrder(List<ProjectTask> projectTaskList, Guid projectGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    session.WriteTransaction(tx => UpdateTaskNodeOrderIndex(tx, projectTaskList));

                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }

        private void UpdateTaskNodeOrderIndex(ITransaction tx, List<ProjectTask> projectTaskList)
        {
            foreach (var task in projectTaskList)
            {
                //Edit the task node based on completion status
                string projectTaskId = task.Guid.ToString();
                int orderIndex = task.orderIndex;
                tx.Run("MATCH (a:ProjectTask) WHERE a.guid = $projectTaskId SET a.orderIndex = $orderIndex",
                    new {projectTaskId, orderIndex});
            }

        }
        
        public RepositoryReturn<bool> EditName(Guid projectGuid, string newProjectName)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    session.WriteTransaction(tx => UpdateProjectNodeName(tx, projectGuid, newProjectName));

                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }

        private void UpdateProjectNodeName(ITransaction tx, Guid projectGuid, string newProjectName)
        {
            string projectId = projectGuid.ToString();
            tx.Run("MATCH (p:Project) WHERE p.guid = $projectId SET p.name = $newProjectName", new {projectId, newProjectName});
        }

        public RepositoryReturn<bool> EditDescription(Guid projectGuid, string newProjectDescription)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    session.WriteTransaction(tx => UpdateProjectNodeDescription(tx, projectGuid, newProjectDescription));

                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }
        
        private void UpdateProjectNodeDescription(ITransaction tx, Guid projectGuid, string newProjectDescription)
        {
            string projectId = projectGuid.ToString();
            tx.Run("MATCH (p:Project) WHERE p.guid = $projectId SET p.description = $newProjectDescription", new {projectId, newProjectDescription});
        }

        public RepositoryReturn<bool> AddTag(Guid projectGuid, Tag newTag)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    session.WriteTransaction(tx => CreateTagNode(tx, newTag));
                    session.WriteTransaction(tx => CreateTagRelationship(tx, projectGuid, newTag));
                    
                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }
        
        private void CreateTagNode(ITransaction tx, Tag tag) {
            //Add the tag node to the database
            string tagName = tag.name;
            tx.Run("MERGE(t:Tag {name: $tagName})", new { tagName });

        }

        private void CreateTagRelationship(ITransaction tx, Guid projectGuid, Tag newTag)
        {
            //Create the relationship to the project
            string projectId = projectGuid.ToString();
            string tagName = newTag.name;
            tx.Run("MATCH (p:Project),(t:Tag) WHERE p.guid = $projectId AND t.name = $tagName CREATE (p)-[:HAS]->(t)", new { projectId, tagName});
        }

        public RepositoryReturn<bool> RemoveTag(Guid projectId, string tagName)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    session.WriteTransaction(tx => RemoveProjectTagRelationship(tx, projectId, tagName));
                    
                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }
        
        private void RemoveProjectTagRelationship(ITransaction tx, Guid projectGuid, string tagName)
        {
            string projectId = projectGuid.ToString();
            tx.Run("MATCH (p:Project)-[r:HAS]-(t:Tag) WHERE p.guid = $projectId AND t.name = $tagName DELETE r", new { projectId, tagName });
        }

        public RepositoryReturn<bool> EditPhotoIndex(Guid projectGuid, int photoIndex)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    session.WriteTransaction(tx => UpdateProjectNodeImageIndex(tx, projectGuid, photoIndex));

                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }
        
        private void UpdateProjectNodeImageIndex(ITransaction tx, Guid projectGuid, int newImageIndex)
        {
            string projectId = projectGuid.ToString();
            tx.Run("MATCH (p:Project) WHERE p.guid = $projectId SET p.imageIndex = $newImageIndex", new {projectId, newImageIndex});
        }

        public RepositoryReturn<bool> Delete(Guid projectGuid)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    var subProjects = session.ReadTransaction(tx => RetrieveSubProjects(tx, projectGuid));
                    foreach (Project subProject in subProjects)
                    {
                        session.WriteTransaction(tx => RemoveProjectUpdates(tx, subProject.Guid));
                        session.WriteTransaction(tx => RemoveProjectTasks(tx, subProject.Guid));
                        session.WriteTransaction(tx => RemoveProjectNode(tx, subProject.Guid));
                    }
                    session.WriteTransaction(tx => RemoveProjectUpdates(tx, projectGuid));
                    session.WriteTransaction(tx => RemoveProjectTasks(tx, projectGuid));
                    session.WriteTransaction(tx => RemoveProjectNode(tx, projectGuid));

                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }
        
        private void RemoveProjectUpdates(ITransaction tx, Guid projectGuid)
        {
            string projectId = projectGuid.ToString();
            tx.Run("MATCH (p:Project) -- (pu:ProjectUpdate) WHERE p.guid = $projectId DETACH DELETE pu", new { projectId });
        }
        
        private void RemoveProjectTasks(ITransaction tx, Guid projectGuid)
        {
            string projectId = projectGuid.ToString();
            tx.Run("MATCH (p:Project) -- (pt:ProjectTask) WHERE p.guid = $projectId DETACH DELETE pt", new { projectId });
        }
        
        private void RemoveProjectNode(ITransaction tx, Guid projectGuid)
        {
            string projectId = projectGuid.ToString();
            tx.Run("MATCH (p:Project) WHERE p.guid = $projectId DETACH DELETE p", new { projectId });
        }
        
        /**
         * Add a relationship between a project and a given user.
         */
        public RepositoryReturn<bool> AddProjectMember(Guid projectGuid, Guid newMemberGuid)
        {
//            var client = new GraphClient(new Uri(_databaseHttpUrl + "/db/data"), _dbUser, _dbPw);
            try
            {
                using (_session)
                {
                    _session.WriteTransaction(tx => AddMemberRelationship(tx, projectGuid, newMemberGuid));
                    return new RepositoryReturn<bool>(true);
                }

//                client.Connect();
//                client.Cypher
//                    .Match("(project:Project), (newOwner:Person)")
//                    .Where((Person newMember) => newMember.Guid == newMemberGuid)
//                    .AndWhere((Project project) => project.Guid == projectGuid)
//                    .CreateUnique("(newOwner)-[:CONTRIBUTES_TO {type:ownerType}]->(project)")
//                    .WithParam("ownerType", "type")
//                    .ExecuteWithoutResults();
            }
            catch (ServiceUnavailableException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
            catch (Exception e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }


        /**
         * Remove a relationship between a project and a given member.
         */
        public RepositoryReturn<bool> RemoveProjectMember(Guid projectGuid, Guid memberGuid)
        {
//            var client = new GraphClient(new Uri(_databaseHttpUrl + "/db/data"), _dbUser, _dbPw);
            try
            {
                using (_session)
                {
                    _session.WriteTransaction(tx => RemoveMemberRelationship(tx, projectGuid, memberGuid));
                    return new RepositoryReturn<bool>(true);
                }
//                client.Connect();
//                client.Cypher
//                    .Match("(contributor:Person)-[contributes:CONTRIBUTES_TO]-(project:Project)")
//                    .Where((Person contributor) => contributor.Guid == memberGuid)
//                    .AndWhere((Project project) => project.Guid == projectGuid)
//                    .Delete("contributes")
//                    .ExecuteWithoutResults();
            }
            catch (ServiceUnavailableException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
            catch (Exception e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }


        private void AddMemberRelationship(ITransaction tx, Guid projectGuid, Guid newMemberGuid)
        {
            var projectId = projectGuid.ToString();
            var newMemberId = newMemberGuid.ToString();
            
            const string statement = "MATCH (project:Project), (newMember:Person) " +
                                     "WHERE project.guid = $projectId " +
                                     "AND newMember.guid = $newMemberId " + 
                                     "CREATE UNIQUE (newMember)-[:CONTRIBUTES_TO]->(project)";
            tx.Run(statement, new {projectId, newMemberId});
        }
        
        private void RemoveMemberRelationship(ITransaction tx, Guid projectGuid, Guid memberGuid)
        {
            var projectId = projectGuid.ToString();
            var memberId = memberGuid.ToString();
            
            const string statement = "MATCH (member:Person)-[contributes:CONTRIBUTES_TO]-(project:Project) " +
                                     "WHERE member.guid = $memberId " + 
                                     "AND project.guid = $projectId " +
                                     "DELETE contributes";
            tx.Run(statement, new {memberId, projectId});
        }
        
        public RepositoryReturn<bool> AddSubProject(Guid parentProjectGuid, Project newSubProject)
        {
            try
            {
                using (var session = _neo4jConnection.driver.Session())
                {
                    session.WriteTransaction(tx => CreateSubProjectNode(tx, newSubProject, parentProjectGuid));
                    session.WriteTransaction(tx => CreateProjectToSubProjectRelationship(tx, newSubProject, parentProjectGuid));

                    session.WriteTransaction(tx => CreateTaskNodes(tx, newSubProject.taskList));
                    session.WriteTransaction(tx => CreateTaskRelationships(tx, newSubProject.taskList, newSubProject.Guid));
                    return new RepositoryReturn<bool>(true);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<bool>(true, e);
            }
        }

        private void CreateSubProjectNode(ITransaction tx, Project subProject, Guid parentProjectGuid)
        {
            string projectName = subProject.name;
            string projectDescription = subProject.description;
            string projectImageIndex = subProject.imageIndex.ToString();
            string projectGuid = subProject.Guid.ToString();
            string parentProjectId = parentProjectGuid.ToString();
            tx.Run("CREATE(p:Project {name: $projectName, " +
                   "description: $projectDescription, " +
                   "imageIndex: $projectImageIndex, " +
                   "dateTimeCreated: localdatetime({ timezone: 'Pacific/Auckland' }), " +
                   "parentProjectGuid: $parentProjectId, " +
                   "guid: $projectGuid})", 
                new { projectName, projectDescription, projectImageIndex, parentProjectId, projectGuid });
        }

        private void CreateProjectToSubProjectRelationship(ITransaction tx, Project subProject, Guid parentProjectGuid)
        {
            //Create the relationship to the project
            string parentProjectId = parentProjectGuid.ToString();
            string childProjectId = subProject.Guid.ToString();
            tx.Run("MATCH (parent:Project),(child:Project) " +
                   "WHERE parent.guid = $parentProjectId AND child.guid = $childProjectId " +
                   "CREATE (child)-[:IS_SUBPROJECT_OF]->(parent)", 
                new { parentProjectId, childProjectId });
        }
        
        public RepositoryReturn<IEnumerable<Project>> GetSubProjects(Guid parentProjectGuid)
        {
            try
            {   
                using (_session)
                {
                    var returnedSubProjects = _session.ReadTransaction(tx => RetrieveSubProjects(tx, parentProjectGuid));
                    
                    return new RepositoryReturn<IEnumerable<Project>>(returnedSubProjects);
                }
            }
            catch (Neo4jException e)
            {
                return new RepositoryReturn<IEnumerable<Project>>(true, e);
            }
        }
        
        private List<Project> RetrieveSubProjects(ITransaction tx, Guid parentProjectGuid)
        {
            var parentProjectId = parentProjectGuid.ToString();
            var result = tx.Run("MATCH (child:Project) -[:IS_SUBPROJECT_OF]-> (parent:Project) " +
                                "WHERE parent.guid = $parentProjectId RETURN child", 
                new { parentProjectId });

            var records = result.Select(record => new Project(record[0].As<INode>().Properties)).ToList();

            return records;
        }
    }
}
