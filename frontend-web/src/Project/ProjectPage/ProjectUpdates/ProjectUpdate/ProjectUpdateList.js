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
    }

    render() {

        const { project } = this.props;
        const { projectUpdates } = this.state;

        if(projectUpdates.length == 0) {
            return (
                <Segment placeholder style={{marginRight: '5em', marginLeft: '5em'}}>
                    <Header icon>
                        No updates have been made for this project.
                    </Header>
                </Segment>
            )
        } 
        else {
            return(
                <Segment style={{ marginLeft: '5em', marginRight: '5em'}}>
                    {projectUpdates.map((update, index) => (
                        <ProjectUpdate
                            tags={project.tagList}
                            projectName={project.name}
                            update={update}
                            index={index}
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
