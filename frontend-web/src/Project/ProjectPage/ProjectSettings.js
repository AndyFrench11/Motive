import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, Label, Menu, Input, Button, Icon, Card, Confirm
} from 'semantic-ui-react'
import {connect} from "react-redux";
import uuidv4 from 'uuid/v4';

class ProjectSettings extends React.Component {
    state = { 
        deleteProjectConfirmOpen: false, 
        deleteProjectResult: '' 
    }

    showDeleteProjectConfirm = () => this.setState({ deleteProjectConfirmOpen: true })
    handleConfirmProjectDeletion = () => {
        this.setState({ deleteProjectResult: 'confirmed', deleteProjectConfirmOpen: false });
        // Update the backend
        //this.props.history.push(`/home`);
    }
    handleCancelProjectDeletion = () => this.setState({ deleteProjectResult: 'cancelled', deleteProjectConfirmOpen: false })

    render() {
        const { deleteProjectConfirmOpen, deleteProjectResult } = this.state    
        
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

const mapStateToProps = state => {
    return {};
};

export default connect(mapStateToProps)(ProjectSettings);
