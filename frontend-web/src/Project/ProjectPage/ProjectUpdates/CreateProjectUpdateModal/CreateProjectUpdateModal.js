import React from 'react'
import {
    Button, Modal, Icon, Form, TextArea, Progress, Divider, Dropdown, Input, Image, Segment, Grid, Header, Label
} from 'semantic-ui-react'
import {connect} from "react-redux";
import uuidv4 from 'uuid/v4';
import { postProjectUpdate } from "./actions";
import TrophyImage from '../../../ProjectImages/image16.png';

class CreateProjectUpdateModal extends React.Component {

    constructor(props) {
        super(props);

        this.taskOptions = this.props.project.taskList.map((task, index) => {
            return {
                key: task.guid,
                text: task.name,
                value: task.guid
            }
        });

        const { completedTaskIndex } = this.props;

        if(completedTaskIndex !== -1) {
            this.state = { 
                contentInput: "",
                selectedTaskGuid: this.props.project.taskList[completedTaskIndex].guid
            };
    
        } else {
            this.state = { 
                contentInput: "",
                selectedTaskGuid: ""
            };
        }

    }

    updateContentInput = (event, {value}) => {
        this.setState({ contentInput: value });
    }

    updateSelectedTask = (event, { key, value }) => {
        this.setState({ selectedTaskGuid: value });
    };

    confirmNewUpdate = () => {
        const { contentInput, selectedTaskGuid } = this.state;
        let update = { content: contentInput }
        if(selectedTaskGuid !== "")
        {
            update["taskGuid"] = selectedTaskGuid;
        }
        
        this.props.postProjectUpdate(this.props.project.guid, this.props.user.guid, update)
        this.props.closeCallback()
    }

    render() {

        const { user, project, completedTaskIndex } = this.props;

        return (
            <Modal open={true} onClose={this.props.closeCallback} closeIcon>
                <Modal.Header>Create a new update.</Modal.Header>
                <Modal.Content>
                    <Segment>
                        <Grid columns='three' divided>
                            <Grid.Column width={2}>
                                <Image avatar src='https://react.semantic-ui.com/images/avatar/large/matthew.png' size="tiny"/>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Header size='large'>Update from {user.firstName}</Header>
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <Grid.Row>
                                    <Header size='large'>{project.name}</Header>    
                                </Grid.Row>
                                <Grid.Row>
                                    {project.tagList.map((tag, index) =>
                                        <Label key={index} >
                                            #{project.tagList[index].name}
                                        </Label>
                                    )}
                                </Grid.Row>
                                
                            </Grid.Column>
                                
                        </Grid>
                        
                        <Divider/>
                        {completedTaskIndex !== -1 &&
                            <Segment>
                                <Grid>
                                    <Grid.Column width={2}>
                                        <Image src={TrophyImage} size='large' rounded />
                                    </Grid.Column>
                                    <Grid.Column width={10}>
                                        <Header style={{'marginTop': 3}} size='medium'>Task Completed: {project.taskList[completedTaskIndex].name}</Header>
                                    </Grid.Column>
                                </Grid>
                            </Segment>
                        }
                        <Form>
                            <TextArea placeholder='Tell us more...' onChange={this.updateContentInput}/>

                            {completedTaskIndex === -1 &&

                                <Divider/>
                            }
                            {completedTaskIndex === -1 && 
                                <Dropdown
                                    placeholder='Does this relate to a task?'
                                    fluid
                                    selection
                                    options={this.taskOptions}
                                    clearable
                                    onChange={this.updateSelectedTask}
                                />
                            }
                            {completedTaskIndex === -1 &&
                                <Divider/>
                            }
                        </Form>

                    </Segment>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='red' inverted onClick={this.props.closeCallback}>
                        <Icon name='remove'/> Cancel
                    </Button>
                    <Button color='green' inverted onClick={this.confirmNewUpdate}>
                        <Icon name='checkmark'/> Update
                    </Button>
                </Modal.Actions>
            </Modal>
        );
  }
}

function mapDispatchToProps(dispatch) {
    return {
        postProjectUpdate: (projectGuid, userGuid, update) => dispatch(postProjectUpdate(projectGuid, userGuid, update)),
    };
}

const mapStateToProps = state => {
    const { createProjectUpdateReducer } = state;
    const { createProjectUpdateController } = createProjectUpdateReducer;
    const { isUpdating, lastUpdated, result } = createProjectUpdateController;
    return {
        isUpdating: isUpdating,
        result: result,
        lastUpdated: lastUpdated,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateProjectUpdateModal);