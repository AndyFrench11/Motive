import React from 'react'
import {Header, Menu, Sidebar} from 'semantic-ui-react'
import StatusDropdown from "../TaskStatus/StatusDropdown";
import {connect} from "react-redux";
import {deleteStatus, updateStatus, getStatus} from "../TaskStatus/actions";
import PriorityDropdown from "../TaskPriority/PriorityDropDown";
import {deletePriority, updatePriority} from "../TaskPriority/actions";
import AssignmentDropDown from "../TaskAssignment/AssignmentDropDown";
import {getAssignee, updateAssignee} from "../TaskAssignment/actions";
import taskAssigneeReducer from "../TaskAssignment/reducers";

class TaskDetailsSidebar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            status: this.props.status,
            assignee: this.props.assignee
        }
    }

    componentDidMount() {
        const {currentUser, task} = this.props;
        this.props.fetchAssignee(currentUser.guid, task.guid).then(() => {
            this.setState({assignee: this.props.assignee});
            console.log(this.state.assignee);
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {currentUser, task} = this.props;
        this.props.fetchAssignee(currentUser.guid, task.guid).then(() => {
            this.setState({assignee: this.props.assignee});
            console.log(this.state.assignee);
        });
    }

    getStatus = () => {
        const {currentUser, task} = this.props;
        this.props.fetchStatus(currentUser.guid, task.guid).then(() => {
            this.setState({status: this.props.status});
            console.log(this.state.status);
        });
    };

    setStatusCallback = (value) => {
        const {currentUser, task} = this.props;
        // Update status request
        this.props.setStatus(currentUser.guid, task.guid, value).then(() => {
            // Update state
            this.props.updateStatusCallback(task, value);
        });
    };

    deleteStatusCallback = () => {
        const {currentUser, task} = this.props;
        // Delete status request
        this.props.removeStatus(currentUser.guid, task.guid).then(() => {
            // Update state
            this.props.updateStatusCallback(task, 0);
        });
    };

    setPriorityCallback = (value) => {
        const {currentUser, task} = this.props;
        // Update priority request
        this.props.setPriority(currentUser.guid, task.guid, value).then(() => {
            // Update state
            this.props.updatePriorityCallback(task, value);
        });
    };

    deletePriorityCallback = () => {
        const {currentUser, task} = this.props;
        // Delete priority request
        this.props.removePriority(currentUser.guid, task.guid).then(() => {
            // Update state
            this.props.updatePriorityCallback(task, 0);
        });
    };

    setAssigneeCallback = (value) => {
        const {currentUser, task} = this.props;
        // Update assignee request
        this.props.setAssignee(currentUser.guid, task.guid, value).then(() => {
            // Update state
            this.props.fetchAssignee(currentUser.guid, task.guid).then(() => {
                this.setState({assignee: this.props.assignee});
                this.props.updateAssigneeCallback(task, this.props.assignee);
            });
        });
    };

    render() {
        const {visible} = this.props;
        const {task} = this.props;
        const {assignee} = this.state;
        return (
            <Sidebar
                as={Menu}
                animation='overlay'
                direction='right'
                icon='labeled'
                inverted
                onHide={this.props.hideSidebarCallback}
                vertical
                visible={visible}
                width='thin'
            >
                <Menu.Item>
                    <Header
                        inverted
                    >Status</Header>
                    <StatusDropdown
                        task={task}
                        setStatusCallback={this.setStatusCallback}
                        deleteStatusCallback={this.deleteStatusCallback}
                    />
                </Menu.Item>

                <Menu.Item>
                    <Header
                        inverted
                    >Priority</Header>
                    <PriorityDropdown
                        currentPriority={task.priority}
                        setPriorityCallback={this.setPriorityCallback}
                        deletePriorityCallback={this.deletePriorityCallback}
                    />
                </Menu.Item>

                <Menu.Item>
                    <Header
                        inverted
                    >Assignee</Header>
                    <AssignmentDropDown
                        currentAssignee={assignee}
                        setAssigneeCallback={this.setAssigneeCallback}
                        projectOwners={this.props.projectOwners}
                    />
                </Menu.Item>
            </Sidebar>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchStatus: (userGuid, taskGuid) => dispatch(getStatus(userGuid, taskGuid)),
        setStatus: (userGuid, taskGuid, newStatus) => dispatch(updateStatus(userGuid, taskGuid, newStatus)),
        removeStatus: (userGuid, taskGuid) => dispatch(deleteStatus(userGuid, taskGuid)),
        setPriority: (userGuid, taskGuid, newPriority) => dispatch(updatePriority(userGuid, taskGuid, newPriority)),
        removePriority: (userGuid, taskGuid) => dispatch(deletePriority(userGuid, taskGuid)),
        setAssignee: (userGuid, taskGuid, assigneeGuid) => dispatch(updateAssignee(userGuid, taskGuid, assigneeGuid)),
        fetchAssignee: (userGuid, taskGuid) => dispatch(getAssignee(userGuid, taskGuid))
    };
}

const mapStateToProps = state => {
    const {taskStatusReducer, taskPriorityReducer, taskAssigneeReducer} = state;

    const {statusController} = taskStatusReducer;
    const {status} = statusController;

    const {priorityController} = taskPriorityReducer;
    const {priority} = priorityController;

    const {assigneeController} = taskAssigneeReducer;
    const {assignee} = assigneeController;

    return {
        status: status,
        priority: priority,
        assignee: assignee,
        currentUser: state.authReducer.authController.currentUser
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetailsSidebar);