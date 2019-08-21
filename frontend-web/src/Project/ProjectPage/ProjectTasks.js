import React, {Component} from 'react';
import {
    Image, Segment, List, Button, Icon, Input, Transition, Label, Form, Grid, Header
} from 'semantic-ui-react'
import {connect} from "react-redux";
class ProjectTasks extends Component {

    constructor(props) {
        super(props);

        this.taskInput = React.createRef();

        this.state = {
            activeCreateTaskButton: false,
            taskList: this.props.taskList,
            taskInputVisible: false,
            currentInput: ""
        };

    }

    addNewTask = () => {

        if(this.state.taskInputVisible === true){
            console.log("Hello");
            const { currentInput } = this.state;
            if(currentInput !== "") {
                this.state.taskList.push({name: this.state.currentInput});
                //TODO Update the backend!

            }
            this.setState({
                    activeCreateTaskButton: false,
                    taskInputVisible: false,
                    currentInput: ""
                }
            );
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
        console.log("Yarp");
        this.setState({ currentInput: value });

    };

    deleteTask = (event, {index}) => {
        var { taskList } = this.state;
        taskList.splice(index, 1);
        this.setState({taskList: taskList});
        //TODO Update the backend!
    };

    markTaskAsDone = (event, {listIndex}) => {
        const {taskList} = this.state;
        taskList.map((task, index) => {
            if(index === listIndex){
                task.completed = !task.completed;
            }
        });
        this.setState({taskList: taskList});
        //TODO Update the backend!

    };


    render() {

        const { taskList, activeCreateTaskButton, taskInputVisible, selectedTaskIndex } = this.state;

        return (
            <div>
                <Segment style={{ marginLeft: '5em', marginRight: '5em', marginBottom: '5em'}}>


                    <Transition.Group as={List} duration={500} divided size='large' verticalAlign='middle'>
                        {taskList.map((task, index) =>
                            <List.Item key={index}>
                                <List.Content floated='left'>
                                    <Button listIndex={index} basic circular toggle active={task.completed} onClick={this.markTaskAsDone}
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


                    <Grid divided='vertically' left>
                        <Grid.Row >
                            <Grid.Column width={1} left>
                                <Button basic circular toggle active={activeCreateTaskButton} onClick={this.addNewTask}
                                        icon='plus'>
                                </Button>
                            </Grid.Column>
                            <Grid.Column width={4} left>
                                <Transition visible={taskInputVisible} animation='fade up' duration={400}>
                                    <Input value={this.state.currentInput} placeholder="Enter task name..." onChange={this.updateCurrentInput}/>
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