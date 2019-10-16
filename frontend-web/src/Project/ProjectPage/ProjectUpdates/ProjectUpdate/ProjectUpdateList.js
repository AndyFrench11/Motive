import React from 'react'
import {
    Button, Modal, Icon, Form, TextArea, Progress, Divider, Dropdown, Input, Image, Segment, Grid, Header, Label, Comment, Checkbox
} from 'semantic-ui-react'
import {connect} from "react-redux";
import ProjectUpdate from "./ProjectUpdate";

class ProjectUpdateList extends React.Component {

    constructor(props) {
        super(props);

        this.state = { 
            projectUpdates: this.props.projectUpdates

        };

    }

    deleteUpdateCallback = (index) => {
        const { projectUpdates } = this.state;
        projectUpdates.splice(index, 1);
        this.setState({projectUpdates: projectUpdates})
    };

    render() {

        const { project, listType } = this.props;
        const { projectUpdates } = this.state;
        const listTypes = { 
            "projectUpdates": "No updates have been made for this project.",  
            "projectHighlights": "No highlights have been made for this project.",
            "feedUpdates": "You have not made any updates! Create a project to get started.",
        };

        if(projectUpdates.length === 0) {
            
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
            projectUpdates.sort((a, b) => (a.dateTimeCreated < b.dateTimeCreated) ? 1 : ((b.dateTimeCreated < a.dateTimeCreated) ? -1 : 0));

            return(
                <Segment style={{ marginLeft: '5em', marginRight: '5em'}}>
                    {projectUpdates.map((update, index) => (
                        <ProjectUpdate
                            tags={project.tagList}
                            projectName={project.name}
                            update={update}
                            index={index}
                            comments={update.comments}
                            deleteUpdateCallback={this.deleteUpdateCallback}
                        />
                    ))}
                </Segment>
            );
        }
  }
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

const mapStateToProps = state => {

};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectUpdateList);
