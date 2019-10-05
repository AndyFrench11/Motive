import React from 'react'
import { Header, Icon, Image, Menu, Segment, Sidebar } from 'semantic-ui-react'
import StatusDropdown from "../TaskStatus/StatusDropdown";
import {connect} from "react-redux";
import {deleteStatus, updateStatus, getStatus} from "../TaskStatus/actions";

class TaskDetailsSidebar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            status: this .props.status
        }
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
        this.props.setStatus(currentUser.guid, task.guid, value);
    };

    deleteStatusCallback = () => {
        const {currentUser, task} = this.props;
        // Delete status request
        this.props.removeStatus(currentUser.guid, task.guid);
    };

    render() {
        const {visible} = this.props;

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
                            setStatusCallback={this.setStatusCallback}
                            deleteStatusCallback={this.deleteStatusCallback}
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
        removeStatus: (userGuid, taskGuid) => dispatch(deleteStatus(userGuid, taskGuid))
    };
}

const mapStateToProps = state => {
    const {taskStatusReducer} = state;
    const {statusController} = taskStatusReducer;
    const {status} = statusController;
    return {
        status: status,
        currentUser: state.authReducer.authController.currentUser
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetailsSidebar);