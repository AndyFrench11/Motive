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
        projectNameInputValue: "",
        projectName: this.props.projectName
    };

    updateProjectNameState = () => {
        this.setState({ updatingProjectName: !this.state.updatingProjectName });
    };

    updateProjectNameInputValue = (event, {value}) => {
        this.setState({ projectNameInputValue: value });
    }

    updateProjectName = () => {
        const { projectNameInputValue, projectName } = this.state;
        if((projectNameInputValue !== "") && (projectNameInputValue !== projectName)) {
            this.setState({
                updatingProjectName: false,
                projectNameInputValue: "",
                projectName: projectNameInputValue
            });
            //Update the backend!
            this.props.updateProjectName(this.props.projectGuid, projectNameInputValue)

        } else {
            this.setState({
                updatingProjectName: false,
                projectNameInputValue: "",
            });
        }

    }

    render() {
        const { projectName, updatingProjectName } = this.state;
        return (
            <Grid.Row>
                {updatingProjectName ?  
                    <Input
                        size='big'
                        onChange={this.updateProjectNameInputValue}
                        action
                        defaultValue={projectName}
                        >
                        <input/>
                        <Button icon='check' onClick={this.updateProjectName} size='medium'/>
                        <Button icon='delete' onClick={this.updateProjectNameState} size='medium'/>

                    </Input>
                    : 
                    <Header size='large' onClick={this.updateProjectNameState}>{projectName}</Header>
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
    const { projectDetailsReducer } = state;
    const { projectDetailsController } = projectDetailsReducer;
    const { isUpdating, lastUpdated, result } = projectDetailsController;
    return {
        isUpdating: isUpdating,
        result: result,
        lastUpdated: lastUpdated,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectName);
