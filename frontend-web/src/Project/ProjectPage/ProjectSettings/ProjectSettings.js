import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, Label, Menu, Input, Button, Icon, Card, Confirm
} from 'semantic-ui-react'
import {connect} from "react-redux";
import uuidv4 from 'uuid/v4';
import { deleteProject } from "./actions";
import { Redirect } from "react-router-dom";

class ProjectSettings extends React.Component {

    constructor(props) {
        super(props)
        this.state = { 
            deleteProjectConfirmOpen: false, 
            deleteProjectResult: '',
            returnHome: false
        }
    }

    returnUserHome = () => {
        this.setState({returnHome: true})
    }
    

    showDeleteProjectConfirm = () => this.setState({ deleteProjectConfirmOpen: true })
    handleConfirmProjectDeletion = () => {
        this.setState({ deleteProjectResult: 'confirmed', deleteProjectConfirmOpen: false });
        // Update the backend
        this.props.deleteProject(this.props.projectGuid);
        this.returnUserHome()
    }
    handleCancelProjectDeletion = () => this.setState({ deleteProjectResult: 'cancelled', deleteProjectConfirmOpen: false })

    render() {
        const { deleteProjectConfirmOpen, deleteProjectResult } = this.state    
        
        if (this.state.returnHome === true) {
            return <Redirect to='/home' />
          }
        else {
            return (
                <Segment.Group style={{ marginLeft: '5em', marginRight: '5em'}}>
                    <Segment>
                        <Button negative onClick={this.showDeleteProjectConfirm}>Delete Project</Button>
                        <Confirm
                            open={deleteProjectConfirmOpen}
                            content='Are you sure you want to delete this project?'
                            header='Delete Project'
                            cancelButton='No'
                            confirmButton="Yes"
                            onCancel={this.handleCancelProjectDeletion}
                            onConfirm={this.handleConfirmProjectDeletion}
                            />
                    </Segment>
                    <Segment>{deleteProjectResult}</Segment>
                </Segment.Group>
            );
        }
  }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteProject: (projectGuid) => dispatch(deleteProject(projectGuid)),
    };
}

const mapStateToProps = state => {
    const { projectSettingsReducer } = state;
    const { projectSettingsController } = projectSettingsReducer;
    const { isUpdating, lastUpdated, result } = projectSettingsController;
    return {
        isUpdating: isUpdating,
        result: result,
        lastUpdated: lastUpdated,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSettings);
