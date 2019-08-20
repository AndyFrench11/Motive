import React, {Component} from 'react';
import {
    Image, Segment, List, Button, Icon, Input, Transition, Label, Form, Grid, Header
} from 'semantic-ui-react'
import {connect} from "react-redux";
import BookImage from "../ProjectImages/image15.png";

class ProjectTasks extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeCreateTaskButton: false,
            taskList: this.props.taskList,
            taskInputVisible: false,
            currentInput: ""
        };

    }

    addNewTask = () => {

        if(this.state.taskInputVisible === true){
            const { currentInput } = this.state;
            if(currentInput != "") {
                this.state.taskList.push({name: this.state.currentInput});
            }
            this.setState({
                    activeCreateTaskButton: false,
                    taskInputVisible: false,
                    currentInput: ""
                }

            )

        } else {
            this.setState(
                {
                    activeCreateTaskButton: !this.state.activeCreateTaskButton,
                    taskInputVisible: !this.state.taskInputVisible
                }
            );
        }

    };

    updateCurrentInput = (event, {value}) => {
        //Update the UI
        this.setState({ currentInput: value });

    };

    deleteTask = (event, {index}) => {
        var { taskList } = this.state;
        taskList = taskList.splice(index, 1);
        this.setState({taskList: taskList});
    };


    render() {

        const { taskList, activeCreateTaskButton, taskInputVisible } = this.state;

        return (
            <div>
                <Segment style={{ marginLeft: '5em', marginRight: '5em', marginBottom: '5em'}}>

                    <Transition.Group as={List} duration={500} divided size='large' verticalAlign='middle'>
                        {taskList.map((task, index) =>
                            <List.Item key={index}>
                                <List.Content floated='left'>
                                    <Button basic circular toggle
                                            icon='check'>
                                    </Button>
                                </List.Content>
                                <List.Content floated='right'>
                                    <Button index={index} icon onClick={this.deleteTask} basic circular negative
                                            icon='delete'>
                                    </Button>
                                </List.Content>
                                <List.Content>
                                    {taskList[index].name}
                                </List.Content>
                            </List.Item>
                        )}
                    </Transition.Group>

                    <Grid divided='vertically'  left>
                        <Grid.Row columns={2}>
                            <Grid.Column width={1}>
                                <Button basic circular toggle active={activeCreateTaskButton} onClick={this.addNewTask}
                                        icon='plus'>
                                </Button>
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Transition visible={taskInputVisible} animation='fade up' duration={500}>
                                    <Input  placeholder="Enter task name..." onChange={this.updateCurrentInput}/>
                                </Transition>

                            </Grid.Column>
                        </Grid.Row>
                    </Grid>



                </Segment>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

export default connect(mapStateToProps)(ProjectTasks);