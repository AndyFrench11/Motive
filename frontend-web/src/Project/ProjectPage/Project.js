import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, Label, Menu, Input, Button, Icon, Card, Modal
} from 'semantic-ui-react'

import TopNavBar from '../../Common/TopNavBar'
import Footer from '../../Common/Footer'
import {connect} from "react-redux";
import {fetchProject, fetchProjectProfiles} from "../actions";
import { fetchProjectUpdates } from "./ProjectUpdates/ProjectUpdate/actions";
import LoaderInlineCentered from "../../Common/Loader";
import ProjectTasks from "./ProjectTasks/ProjectTasks";
import ProjectTags from "./ProjectDetails/ProjectTags";
import ProjectName from "./ProjectDetails/ProjectName";
import ProjectDescription from "./ProjectDetails/ProjectDescription";
import ProjectSettings from "./ProjectSettings/ProjectSettings";
import UpdateProjectImageModal from "./ProjectDetails/UpdateProjectImageModal";
import CreateProjectUpdateModal from "./ProjectUpdates/CreateProjectUpdateModal/CreateProjectUpdateModal";
import ProjectUpdateList from "./ProjectUpdates/ProjectUpdate/ProjectUpdateList";
import ProjectTimeline from "./ProjectTimeline/ProjectTimeline";
import SubProjectList from "./SubProjects/SubProjectList";

function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

const images = importAll(require.context('.././ProjectImages', false, /\.(png|jpe?g|svg)$/));


class ProjectPageLayout extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = { 
            activeMenuItem: "Updates",
            updatingProjectImage: false,
            selectedImageIndex: -1,
            createProjectUpdateModalOpen: false
        };
    }


    handleItemClick = (e, { name }) => this.setState({ activeMenuItem: name });
    handleTaskButtonClick = () => this.setState({ activeTaskButton: !this.state.activeTaskButton });

    componentDidMount() {
        const { dispatch } = this.props;
        const { projectguid } = this.props.match.params;
        dispatch(fetchProject(projectguid));
        dispatch(fetchProjectProfiles(projectguid));
        dispatch(fetchProjectUpdates(projectguid));
    }

    showUpdateProjectPhotoModal = () => {
        this.setState({ updatingProjectImage: true })
    }   

    closeUpdateProjectModal = () => {
        this.setState({ updatingProjectImage: false })
    }

    showCreateProjectUpdateModal = () => {
        this.setState({ createProjectUpdateModalOpen: true })
    }   

    closeCreateProjectUpdateModal = (project, user, update) => {
        // if(update !== undefined) {
        //     const { projectUpdates } = this.props;
        //     const { localProjectUpdates } = this.state;
        //     const updates = localProjectUpdates !== null ? localProjectUpdates : projectUpdates;

        //     const relatedTask = project.taskList.filter((task) => task.guid === update.taskGuid);
        //     const updateCopy = Object.assign({}, update, {
        //         relatedPerson: user,
        //         relatedProject: project
        //     });
        //     if(relatedTask === []) {
        //         updateCopy['relatedTask'] = relatedTask
        //     }
        //     updates.push(updateCopy);

        //     this.setState({localProjectUpdates: updates, createProjectUpdateModalOpen: false})
        // } else {
        //     this.setState({ createProjectUpdateModalOpen: false })
        // }       
        this.setState({ createProjectUpdateModalOpen: false })
    }

    updateSelectedImageIndex = (index) => {
        this.setState({ selectedImageIndex: index })
    }

    renderProjectImage(imageIndex) {
        var photoList = Object.keys(images);
        var photoIndex = imageIndex;
        if(this.state.selectedImageIndex !== -1){
            photoIndex = this.state.selectedImageIndex
        }
        return (
            <Grid.Column width={3}>
                <Image 
                    style={{ 'border-radius': 8, 'border-color': '#dddddd', 'border-width': '2px', 'borderStyle': 'solid'}}
                    className='ProjectImage'
                    src={images[photoList[photoIndex]]} 
                    size='small' 
                    onClick={this.showUpdateProjectPhotoModal}/>
            </Grid.Column>
        );
    }

    renderProjectDetails(project) {
        return (
            <Grid.Column width={7}>
                <ProjectName projectName={project.name} projectGuid={project.guid}/>
                <ProjectDescription projectDescription={project.description} projectGuid={project.guid}/>
                <ProjectTags tagList={project.tagList} projectGuid={project.guid}/>
                <Grid.Row style={{'marginTop': '1em'}}>
                    <Button animated size='small' onClick={this.showCreateProjectUpdateModal}>
                        <Button.Content visible>Create new project update!</Button.Content>
                        <Button.Content hidden>
                            Let's CRUSH it! 🦍🦍🦍
                        </Button.Content>
                    </Button>
                </Grid.Row>
            </Grid.Column>
        );
    }

    renderProjectOwnersAndTimeCreated(dateTimeCreated) {
        if (this.props.projectOwners === null || this.props.projectOwners === undefined) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            )
        } else {
            const { projectOwners } = this.props;
            let ownerString = "";
            for(var i = 0; i < projectOwners.length; i++) {
                const owner = projectOwners[i];
                ownerString += `${owner.firstName} ${owner.lastName}`
                if (projectOwners.length > 1) {
                    if (i === projectOwners.length - 2) {
                        ownerString += " and ";
                    } else if(i !== projectOwners.length - 1) {
                        ownerString += ", "
                    }
                }
            }
            //Do something to check if the number of owners is greater than some threshold

            //Get Date Time
            const dateTime = new Date(dateTimeCreated);
            const formattedDateTime = dateTime.toLocaleDateString("en-NZ");

            return (
                <Grid.Column compact width={6} floated='right'>
                    <Grid divided>
                        <Grid.Row>
                            <Grid.Column width={4}>
                                <span>Owned by {ownerString}</span>
                            </Grid.Column>
                            <Grid.Column width={12}> 
                                {projectOwners.map((owner, index) => (
                                    <Image avatar src='https://react.semantic-ui.com/images/avatar/large/matthew.png' size="tiny"/>
                                ))}
                            </Grid.Column>

                        </Grid.Row>
                        <Grid.Row>
                            <p style={{fontSize: 16}}>Created on {formattedDateTime}</p>
                        </Grid.Row>
                    </Grid>
                </Grid.Column>
            );
        }
    }

    renderProjectUpdates(project) {
        const { projectUpdates } = this.props;
        if (projectUpdates === null || projectUpdates === undefined) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            )
        } else {
            
            const updates = projectUpdates;

            return (
                <ProjectUpdateList project={project} projectUpdates={updates} listType="projectUpdates"/>
            );
        }
    }

    renderProjectHighlights(project) {
        const { projectUpdates } = this.props;
        if (projectUpdates === null || projectUpdates === undefined) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            )
        } else {
            const highlights = projectUpdates.filter((update) => update.highlight); 
            return (
                <ProjectUpdateList project={project} projectUpdates={highlights} listType="projectHighlights"/>
            );
        }
    
    }

    renderProjectTimeline(tasks) {
        const { projectUpdates } = this.props;
        if (projectUpdates === null || projectUpdates === undefined) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            )
        } else {
            return (
                <ProjectTimeline updates={projectUpdates} tasks={tasks}/>
            )
        }
        
    }

    renderSubProjects(tags) {
        //const { subProjects } = this.props;
        const subProjects = [];
        if (subProjects === null || subProjects === undefined) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            )
        } else {

            return (
                <SubProjectList subProjects={subProjects} tags={tags}/>
            );
        }
    }

    checkRender() {

        if (this.props.project === null || this.props.project === undefined) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            )
        } else {
            const { project, projectOwners } = this.props;
            const { activeMenuItem, updatingProjectImage, createProjectUpdateModalOpen } = this.state;

            return (
                <div>
                    
                {createProjectUpdateModalOpen &&
                    <CreateProjectUpdateModal 
                    project={project}
                    user={projectOwners[0]}
                    completedTaskIndex={-1} 
                    closeCallback={this.closeCreateProjectUpdateModal}/>
                }
                
                    
                {updatingProjectImage && 
                    <UpdateProjectImageModal 
                        modalOpen={updatingProjectImage} 
                        images={images} 
                        selectedImageIndex={project.imageIndex} 
                        closeCallback={this.closeUpdateProjectModal}
                        updateSelectedImageIndexCallback={this.updateSelectedImageIndex}
                        projectGuid={project.guid}/>
                }

                <Grid style={{ marginTop: '5em', marginLeft: '5em', marginRight: '5em'}}>
                    {this.renderProjectImage(project.imageIndex)}
                    {this.renderProjectDetails(project)}
                    {this.renderProjectOwnersAndTimeCreated(project.dateTimeCreated)}
                </Grid>

                <Divider style={{ marginLeft: '5em', marginRight: '5em'}}/>

                {this.renderProjectTimeline(project.taskList)}

                <Divider style={{ marginLeft: '5em', marginRight: '5em'}}/>

                <Menu pointing secondary style={{ marginLeft: '5em', marginRight: '5em'}}>
                    <Menu.Item
                        name='Updates'
                        active={activeMenuItem === 'Updates'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='Highlights'
                        active={activeMenuItem === 'Highlights'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='Tasks'
                        active={activeMenuItem === 'Tasks'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='Sub-Projects'
                        active={activeMenuItem === 'Sub-Projects'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        name='Settings'
                        active={activeMenuItem === 'Settings'}
                        onClick={this.handleItemClick}
                    />
                </Menu>

                {activeMenuItem === "Tasks" &&
                    <ProjectTasks project={project} projectOwners={projectOwners} projectGuid={project.guid}/>
                }

                {activeMenuItem === "Updates" &&
                    this.renderProjectUpdates(project)
                }

                {activeMenuItem === "Highlights" &&
                    this.renderProjectHighlights(project)                        
                }

                {activeMenuItem === "Sub-Projects" &&
                    this.renderSubProjects(project.tagList)                        
                }

                {activeMenuItem === "Settings" &&
                    <ProjectSettings projectGuid={project.guid}/>
                }

            </div>
            )
        }
    }

    render() {
        return (
          <div>
            <TopNavBar/>
              {this.checkRender()}
            <Footer/>
        </div>
        );
  }
}

const mapStateToProps = state => {
    const { projectController, projectOwnersController, projectUpdateReducer } = state;
    const { isRetrieving, lastUpdated, result } = projectController;
    const { isRetrievingOwners, owners } = projectOwnersController;
    const { projectUpdateController } = projectUpdateReducer;
    const { isRetrievingProjectUpdates, updates} = projectUpdateController;
    return {
        isRetrieving: isRetrieving,
        project: result,
        lastUpdated: lastUpdated,
        projectOwners: owners,
        isRetrievingOwners: isRetrievingOwners,
        isRetrievingProjectUpdates: isRetrievingProjectUpdates,
        projectUpdates: updates
    };
};

export default connect(mapStateToProps)(ProjectPageLayout);

