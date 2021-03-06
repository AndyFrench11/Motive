import React, {Component} from 'react';
import {
    Image, Segment, List, Button, Icon, Input, Transition, Label, Form, Grid, Header, Confirm
} from 'semantic-ui-react'
import {connect} from "react-redux";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import {postTask, deleteTask, updateTask, updateTaskOrder} from "./actions";
import uuidv4 from 'uuid/v4';
import CreateProjectUpdateModal from "../ProjectUpdates/CreateProjectUpdateModal/CreateProjectUpdateModal";
import TaskForum from "../../../TaskForum/TaskForum";
import PriorityDetails from "../../../TaskPriority/PriorityDetails";
import StatusDetails from "../../../TaskStatus/StatusDetails";
import ButtonGroup from "react-bootstrap/es/ButtonGroup";
import AssignmentDetails from "../../../TaskAssignment/AssignmentDetails";

//Drag and Drop Properties
// fake data generator
const getItems = count =>
    Array.from({length: count}, (v, k) => k).map(k => ({
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

const getItemStyle = (isDragging, draggableStyle, taskCompleted) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgrey" : "white",
    borderColor: taskCompleted ? "#23b036" : isDragging ? "grey" : "#dddddd",
    borderRadius: "8px",
    borderStyle: "solid",
    borderWidth: taskCompleted ? "2px" : "1px",


    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    // background: isDraggingOver ? "#adacac" : "lightgrey",
    background: "white",
    padding: grid,
    width: "100%",
    borderRadius: "4px",
});

class ProjectTasks extends Component {

    constructor(props) {
        super(props);

        this.taskInput = React.createRef();

        this.state = {
            activeCreateTaskButton: false,
            taskList: this.props.project.taskList,
            taskInputVisible: false,
            currentInput: "",
            items: getItems(10),
            createProjectUpdateModalOpen: false,
            completedTaskIndex: -1,
            showForum: false,
            forumTask: null,
            markAsDoneOpen: false,
            markDone: null,
            assignee: null
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

        taskList.map((task, index) => {
            task.orderIndex = index;
        });

        this.setState({
            taskList
        });

        //Patch the task list on the project to now be in that order
        this.props.updateTaskOrder(this.props.projectGuid, taskList);

    }

    addNewTask = () => {

        if (this.state.taskInputVisible === true) {
            const {currentInput, taskList} = this.state;
            if (currentInput !== "") {
                //Just used to create a unique id on the front end

                const newIndex = uuidv4();
                const orderIndex = taskList.length;
                taskList.push({name: currentInput, completed: false, orderIndex: orderIndex, guid: newIndex});
                this.setState({
                        taskList: taskList
                    }
                );
                //TODO Update the backend!
                this.props.postTask(this.props.projectGuid, {
                    name: currentInput,
                    completed: false,
                    orderIndex: orderIndex,
                    guid: newIndex
                });

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

        this.setState({currentInput: value});

    };

    deleteTask = (event, {index}) => {
        let {taskList} = this.state;

        this.props.deleteTask(taskList[index].guid);

        taskList.splice(index, 1);

        taskList.map((task, index) => {
            task.orderIndex = index;
        });

        //Patch the task list on the project to now be in that order
        this.props.updateTaskOrder(this.props.projectGuid, taskList);

        this.setState({taskList: taskList});


    };

    // Doesn't work properly yet
    getMarkAsDone = () => {
        const {markAsDoneOpen, markDone} = this.state;
        if (markDone !== null) {
            return (
                <Confirm
                    open={markAsDoneOpen}
                    content={'Would you like to mark the task " ' + markDone.name + ' " as complete?'}
                    header='Mark as Complete'
                    cancelButton='No'
                    confirmButton="Yes"
                    onCancel={this.cancelMarkAsDone}
                    onConfirm={this.confirmMarkAsDone(markDone)}
                />
            );
        }
    };

    cancelMarkAsDone = () => {
        this.setState({markAsDoneOpen: false});
    };

    confirmMarkAsDone = (task) => {
        this.setState({markAsDoneOpen: false, markDone: null});
        const {taskList} = this.state;
        let index = taskList.indexOf(task);
        let completionStatus = taskList[index].completed;
        if (!completionStatus) {
            taskList[index].completed = true;
            this.setState({taskList: taskList, completedTaskIndex: index});
            this.props.updateTask(taskList[index].guid, {completed: true});
            // this.showCreateProjectUpdateModal();
        }
    };

    showMarkAsDoneCallback = (task) => {
        this.setState({markAsDoneOpen: true, markDone: task});
    };

    markTaskAsDone = (event, {listIndex}) => {
        const {taskList} = this.state;
        const completionStatus = taskList[listIndex].completed;

        taskList[listIndex].completed = !completionStatus;
        this.setState({taskList: taskList, completedTaskIndex: listIndex});

        this.props.updateTask(taskList[listIndex].guid, {completed: !completionStatus});

        if (!completionStatus) {
            this.showCreateProjectUpdateModal()
        }
    };

    updateStatusCallback = (task, value) => {
        const {taskList} = this.state;
        let index = taskList.indexOf(task);
        if (index !== -1) {
            taskList[index].status = value;
            this.setState({taskList: taskList});
        }
    };

    updatePriorityCallback = (task, value) => {
        const {taskList} = this.state;
        let index = taskList.indexOf(task);
        if (index !== -1) {
            taskList[index].priority = value;
            this.setState({taskList: taskList});
        }
    };

    updateAssigneeCallback = (task, value) => {
        this.setState({assignee: value});
    };

    showTaskForum = (event, {index}) => {
        const {taskList} = this.state;
        let task = taskList[index];

        this.setState({forumTask: task});
        this.setState({showForum: true});
    };

    hideTaskForumCallback = () => {
        this.setState({showForum: false});
        this.setState({forumTask: null});
    };

    taskDetailInformation(index) {
        const {taskList, assignee} = this.state;
        let task = taskList[index];

        const {currentUser, projectOwners} = this.props;
        let isOwner = false;
        for (let i = 0; i < projectOwners.length; i++) {
            if (projectOwners[i].guid === currentUser.guid) {
                isOwner = true;
                break;
            }
        }

        if (isOwner) {
            return (
                <div>
                    <PriorityDetails
                        priority={task.priority}
                    />
                    <StatusDetails
                        status={task.status}
                    />
                    <AssignmentDetails
                        assignee={assignee}
                    />
                </div>
            );
        }
    }

    deleteButton(index) {
        return (
            <Button index={index}
                    onClick={this.deleteTask}
                    basic
                    negative
                    icon='delete'>
            </Button>
        )
    }

    showForumButton(index) {
        return (
            <Button
                index={index}
                basic
                icon='chevron right'
                onClick={this.showTaskForum}
            >
            </Button>
        )
    }

    taskInteractionButtons(index) {
        const {currentUser, projectOwners} = this.props;
        const {showForum} = this.state;
        let isOwner = false;
        for (let i = 0; i < projectOwners.length; i++) {
            if (projectOwners[i].guid === currentUser.guid) {
                isOwner = true;
                break;
            }
        }

        if (!isOwner || showForum) {
            return (
                <ButtonGroup>
                    {this.deleteButton(index)}
                </ButtonGroup>

            )
        } else {
            return (
                <ButtonGroup>
                    {this.deleteButton(index)}
                    {this.showForumButton(index)}
                </ButtonGroup>
            )
        }
    }

    renderDraggableTasks() {
        let {taskList} = this.state;

        taskList = taskList.sort((a, b) => (a.orderIndex > b.orderIndex) ? 1 : ((b.orderIndex > a.orderIndex) ? -1 : 0));

        return (
            taskList.map((task, index) => (
                <Draggable key={task.guid} draggableId={task.guid} index={index}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style,
                                task.completed
                            )}
                        >

                            <Grid divided='vertically'>
                                <Grid.Row>
                                    <Grid.Column width={1}>
                                        <Button listIndex={index} basic circular toggle active={task.completed}
                                                onClick={this.markTaskAsDone}
                                                icon='check'>
                                        </Button>
                                    </Grid.Column>
                                    <Grid.Column width={8} style={{marginLeft: '2em'}}>
                                        <Grid.Row>
                                            {taskList[index].name}
                                        </Grid.Row>
                                        <Grid.Row>
                                            {this.taskDetailInformation(index)}
                                        </Grid.Row>

                                    </Grid.Column>
                                    <Grid.Column width={2} floated='right' style={{marginRight: '2em'}}>
                                        {this.taskInteractionButtons(index)}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>
                    )}
                </Draggable>
            ))
        )
    }

    showCreateProjectUpdateModal = () => {
        this.setState({createProjectUpdateModalOpen: true})
    };

    closeCreateProjectUpdateModal = () => {
        this.setState({createProjectUpdateModalOpen: false})
    };

    newTaskGrid() {
        const {activeCreateTaskButton, taskInputVisible, showForum} = this.state;
        if (!showForum) {
            return (
                <Grid divided='vertically' left style={{marginTop: '1em'}}>
                    <Grid.Row>
                        <Grid.Column width={1}>
                            <Button basic circular toggle active={activeCreateTaskButton} onClick={this.addNewTask}
                                    icon='plus'>
                            </Button>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            <Transition visible={taskInputVisible} animation='fade up' duration={400}>
                                <Input value={this.state.currentInput} placeholder="Enter task name..."
                                       onChange={this.updateCurrentInput}/>
                            </Transition>

                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }
    }

    taskForum() {
        const {showForum, forumTask} = this.state;
        const {projectOwners} = this.props;
        if (showForum) {
            return (
                <Grid.Column width={12}>
                    <TaskForum
                        task={forumTask}
                        hideTaskForumCallback={this.hideTaskForumCallback}
                        updateStatusCallback={this.updateStatusCallback}
                        updatePriorityCallback={this.updatePriorityCallback}
                        updateAssigneeCallback={this.updateAssigneeCallback}
                        projectOwners={projectOwners}
                    />
                </Grid.Column>
            );
        }
    }

    render() {
        const {createProjectUpdateModalOpen, showForum} = this.state;
        const {projectOwners, project} = this.props;
        let taskWidth = showForum ? 4 : 9;

        return (
            <Segment style={{marginLeft: '5em', marginRight: '5em', marginBottom: '5em'}}>

                {createProjectUpdateModalOpen &&
                <CreateProjectUpdateModal
                    project={project}
                    user={projectOwners[0]}
                    completedTaskIndex={this.state.completedTaskIndex}
                    closeCallback={this.closeCreateProjectUpdateModal}/>
                }
                <Grid>
                    <Grid.Column width={taskWidth}>
                        <DragDropContext onDragEnd={this.onDragEnd}>
                            <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        style={getListStyle(snapshot.isDraggingOver)}
                                    >
                                        {this.renderDraggableTasks()}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>

                        {this.newTaskGrid()}
                    </Grid.Column>

                    {this.taskForum()}
                </Grid>
            </Segment>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        postTask: (projectGuid, values) => dispatch(postTask(projectGuid, values)),
        deleteTask: (taskGuid) => dispatch(deleteTask(taskGuid)),
        updateTask: (taskGuid, values) => dispatch(updateTask(taskGuid, values)),
        updateTaskOrder: (projectGuid, taskList) => dispatch(updateTaskOrder(projectGuid, taskList))
    };
}

const mapStateToProps = state => {
    const {projectTaskReducer} = state;
    const {projectTaskController} = projectTaskReducer;
    const {isUpdating, lastUpdated, result} = projectTaskController;
    return {
        isUpdating: isUpdating,
        result: result,
        lastUpdated: lastUpdated,
        currentUser: state.authReducer.authController.currentUser
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTasks);