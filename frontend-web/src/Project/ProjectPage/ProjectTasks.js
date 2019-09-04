import React, {Component} from 'react';
import {
    Image, Segment, List, Button, Icon, Input, Transition, Label, Form, Grid, Header
} from 'semantic-ui-react'
import {connect} from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

//Drag and Drop Properties
// fake data generator
const getItems = count =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k}`,
        content: `item ${k}`
    }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgrey" : "white",
    borderColor: isDragging ? "grey" : "#dddddd",
    borderRadius: "8px",
    borderStyle: "solid",
    borderWidth: "1px",


    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    // background: isDraggingOver ? "#adacac" : "lightgrey",
    background: "white",
    padding: grid,
    width: "50%",
    borderRadius: "4px",
});

class ProjectTasks extends Component {

    constructor(props) {
        super(props);

        this.taskInput = React.createRef();

        this.state = {
            activeCreateTaskButton: false,
            taskList: this.props.taskList,
            taskInputVisible: false,
            currentInput: "",
            items: getItems(10)

        };

        this.onDragEnd = this.onDragEnd.bind(this);

    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const taskList = reorder(
            this.state.taskList,
            result.source.index,
            result.destination.index
        );

        this.setState({
            taskList
        });
    }

    addNewTask = () => {

        if(this.state.taskInputVisible === true){
            const { currentInput, taskList } = this.state;
            if(currentInput !== "") {
                const newIndex = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                taskList.push({name: currentInput, guid: newIndex});
                this.setState({
                        taskList: taskList
                    }
                );

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



                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                >
                                    {this.state.taskList.map((task, index) => (
                                        <Draggable key={task.guid} draggableId={task.guid} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        snapshot.isDragging,
                                                        provided.draggableProps.style
                                                    )}
                                                >

                                                    <Grid divided='vertically' >
                                                        <Grid.Row >
                                                            <Grid.Column width={1} >
                                                                <Button listIndex={index} basic circular toggle active={task.completed} onClick={this.markTaskAsDone}
                                                                        icon='check'>
                                                                </Button>
                                                            </Grid.Column>
                                                            <Grid.Column width={10} style={{marginLeft: '2em'}}>
                                                                {taskList[index].name}

                                                            </Grid.Column>
                                                            <Grid.Column width={1} floated='right' style={{marginRight:'2em'}}>
                                                                <Button index={index} icon onClick={this.deleteTask} basic circular negative
                                                                        icon='delete'>
                                                                </Button>
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    </Grid>


                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>


                    <Grid divided='vertically' left style={{marginTop:'1em'}}>
                        <Grid.Row >
                            <Grid.Column width={1}>
                                <Button basic circular toggle active={activeCreateTaskButton} onClick={this.addNewTask}
                                        icon='plus'>
                                </Button>
                            </Grid.Column>
                            <Grid.Column width={4}>
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