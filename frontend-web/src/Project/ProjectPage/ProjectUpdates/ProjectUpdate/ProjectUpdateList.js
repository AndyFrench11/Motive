import React from 'react'
import {
    Button, Modal, Icon, Form, TextArea, Progress, Divider, Dropdown, Input, Image, Segment, Grid, Header, Label, Comment, Checkbox
} from 'semantic-ui-react'
import {connect} from "react-redux";
import ProjectUpdate from "./ProjectUpdate";
import { fetchProjectUpdates } from "./actions";
import LoaderInlineCentered from "../../../../Common/Loader";

class ProjectUpdateList extends React.Component {

    constructor(props) {
        super(props);

        this.state = { 

        };

    }

    componentDidMount() {
        const { guid } = this.props.project;
        this.props.fetchProjectUpdates(guid);
    }

    render() {

        const { projectUpdates } = this.props;
        if (projectUpdates === null || projectUpdates === undefined) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            )
        } else {
            const { project, listType } = this.props;
            const { projectUpdates } = this.props;
            const listTypes = { 
                "projectUpdates": "No updates have been made for this project.",  
                "projectHighlights": "No highlights have been made for this project.",
                "feedUpdates": "You have not made any updates! Create a project to get started.",
            };
            
            var updates = projectUpdates;
            if(listType === "projectHighlights") {
                updates = projectUpdates.filter((update) => update.highlight); 
            } 
            
            if(updates.length === 0) {
                
                return (
                    <Segment placeholder style={{marginRight: '5em', marginLeft: '5em'}}>
                        <Header icon>
                            { listTypes[listType] }
                        </Header>
                    </Segment>
                )
            } 
            else {
                //Sort the project updates based on time created
                updates.sort((a, b) => (a.dateTimeCreated < b.dateTimeCreated) ? 1 : ((b.dateTimeCreated < a.dateTimeCreated) ? -1 : 0));

                return(
                    <Segment style={{ marginLeft: '5em', marginRight: '5em'}}>
                        {updates.map((update, index) => (
                            <ProjectUpdate
                                tags={project.tagList}
                                projectName={project.name}
                                update={update}
                                index={index}
                                comments={update.comments}
                            />
                        ))}
                    </Segment>
                );
            }
        }
  }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchProjectUpdates: (projectGuid) => dispatch(fetchProjectUpdates(projectGuid))
    };
}

const mapStateToProps = state => {
    const { projectUpdateReducer } = state;
    const { projectUpdateController } = projectUpdateReducer;
    const { isRetrievingProjectUpdates, updates} = projectUpdateController;

    return {
        isRetrievingProjectUpdates: isRetrievingProjectUpdates,
        projectUpdates: updates
    }

};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectUpdateList);
