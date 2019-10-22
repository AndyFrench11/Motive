import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, Label, Menu, Input, Button, Icon, Card,
} from 'semantic-ui-react'
import {connect} from "react-redux";
import uuidv4 from 'uuid/v4';
import { updateProjectName } from "./actions";

class ProjectName extends React.Component {
    state = { 
        updatingProjectName: false,
        projectNameInputValue: ""
    };

    updateProjectNameState = () => {
        this.setState({ updatingProjectName: !this.state.updatingProjectName });
    };

    updateProjectNameInputValue = (event, {value}) => {
        this.setState({ projectNameInputValue: value });
    };

    updateProjectName = () => {
        const { projectNameInputValue } = this.state;
        if((projectNameInputValue !== "") && (projectNameInputValue !== this.props.currentProject.name)) {
            this.setState({
                updatingProjectName: false,
                projectNameInputValue: ""
            });
            //Update the backend!
            this.props.updateProjectName(this.props.currentProject.guid, projectNameInputValue)

        } else {
            this.setState({
                updatingProjectName: false,
                projectNameInputValue: "",
            });
        }

    }

    render() {
        const { updatingProjectName } = this.state;
        const { name } = this.props.currentProject;
        return (
            <Grid.Row>
                {updatingProjectName ?  
                    <Input
                        size='big'
                        onChange={this.updateProjectNameInputValue}
                        action
                        defaultValue={name}
                        >
                        <input/>
                        <Button icon='check' onClick={this.updateProjectName} size='medium'/>
                        <Button icon='delete' onClick={this.updateProjectNameState} size='medium'/>

                    </Input>
                    : 
                    <Header size='large' onClick={this.updateProjectNameState}>{name}</Header>
                }
            </Grid.Row>
        );
  }
}

function mapDispatchToProps(dispatch) {
    return {
        updateProjectName: (projectGuid, projectName) => dispatch(updateProjectName(projectGuid, projectName)),
    };
}

const mapStateToProps = state => {

    return {
        currentProject: state.projectController.result
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectName);
