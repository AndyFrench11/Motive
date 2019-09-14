import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, Label, Menu, Input, Button, Icon, Card,
} from 'semantic-ui-react'
import {connect} from "react-redux";
import uuidv4 from 'uuid/v4';

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

const mapStateToProps = state => {
    return {};
};

export default connect(mapStateToProps)(ProjectName);
