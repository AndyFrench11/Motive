import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, Label, Menu, Input, Button, Icon, Card, Modal, List, Comment, Form, Sidebar
} from 'semantic-ui-react'
import {connect} from "react-redux";
import {createChannel, updateChannel, deleteChannel, getAllChannels} from "./channelActions";
import ChannelList from "./Channels/ChannelList";
import ChannelMessageList from "./Messages/ChannelMessageList";
import TaskDetailsSidebar from "./TaskDetailsSidebar";

const getHeaderStyle = () => ({
    padding: 12,
    paddingLeft: 40
});

class TaskForum extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedChannel: null,
            channels: this.props.channels,
            loadingChannels: true,
            sidebarVisible: false
        };
    }

    componentDidMount() {
        const {currentUser, task} = this.props;
        // Get all channels
        this.setState({loadingChannels: true});
        this.props.getChannels(currentUser.guid, task.guid).then(() => {
            this.setState({channels: this.props.channels});
            this.setState({loadingChannels: false});
        });
    }

    addChannelCallback = (channelName) => {
        const {currentUser, task} = this.props;
        // Create channel
        this.props.addChannel(currentUser.guid, task.guid, channelName).then(()=> {
           // Add to state
           this.setState(previous => ({channels: [...previous.channels, this.props.newChannel]}));
        });
    };

    editChannelCallback = (channel, newName) => {
        const {currentUser} = this.props;
        // Edit channel request
        return this.props.editChannel(currentUser.guid, channel.guid, newName);

    };

    deleteChannelCallback = (channel) => {
        const {currentUser} = this.props;
        const {channels, selectedChannel} = this.state;

        // Delete channel request
        this.props.deleteChannel(currentUser.guid, channel.guid)
            .then(() => {
                // Remove from state
                let index = channels.indexOf(channel);
                if (index !== -1) {
                    channels.splice(index, 1);
                    this.setState({channels: channels})
                }
                // If the deleted channel is the selected channel, set the selected channel to null
                if (selectedChannel === channel) {
                    this.setState({selectedChannel: null});
                }
            });
    };

    selectChannelCallback = (channel) => {
        this.setState({selectedChannel: channel});
    };

    showSidebar = () => {
        this.setState({sidebarVisible: true});
    };

    hideSidebarCallback = () => {
        this.setState({sidebarVisible: false});
    };

    channels() {
        const {channels, loadingChannels} = this.state;
        return (
            <ChannelList
                channels={channels}
                loadingChannels={loadingChannels}
                addChannelCallback={this.addChannelCallback}
                deleteChannelCallback={this.deleteChannelCallback}
                editChannelCallback={this.editChannelCallback}
                selectChannelCallback={this.selectChannelCallback}
            />
        )
    }

    messages() {
        const {selectedChannel} = this.state;
        if (selectedChannel === null) {
            return (
                <Segment placeholder style={{overflow: 'auto', height: 400 }}>
                    <Header icon>
                        <Icon name='newspaper outline' />
                        Please select a channel.
                    </Header>
                </Segment>
            )
        } else {
            return (
                <ChannelMessageList
                    channel={this.state.selectedChannel}/>
            );
        }
    }

    mainContent() {
        const {task} = this.props;
        const {sidebarVisible} = this.state;
        return (
            <Sidebar.Pushable as={Segment}>
                <TaskDetailsSidebar
                    visible={sidebarVisible}
                    hideSidebarCallback={this.hideSidebarCallback}
                    task={task}
                    updateStatusCallback={this.props.updateStatusCallback}
                    updatePriorityCallback={this.props.updatePriorityCallback}
                    updateAssigneeCallback={this.props.updateAssigneeCallback}
                    projectOwners={this.props.projectOwners}
                />
                <Sidebar.Pusher>
                    {this.messages()}
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        );
    }

    render() {
        const {task} = this.props;
        return (
            <div>
                <Grid celled>
                    <Grid.Row color='black'>
                        <Button
                            style={{padding: 14}}
                            inverted
                            onClick={this.props.hideTaskForumCallback}>
                            Back
                        </Button>
                        <Header
                            as='h2'
                            textAlign='center'
                            style={getHeaderStyle()}
                            inverted>
                            {task.name}
                        </Header>
                        <Button
                            padding={14}
                            inverted
                            onClick={this.showSidebar}>
                            Show Task Details
                        </Button>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column width={5} style={{overflow: 'auto', height: 700 }}>
                            {this.channels()}
                        </Grid.Column>
                        <Grid.Column width={11}>
                            {this.mainContent()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addChannel: (userGuid, taskGuid, name) => dispatch(createChannel(userGuid, taskGuid, name)),
        getChannels:(userGuid, taskGuid) => dispatch(getAllChannels(userGuid, taskGuid)),
        editChannel: (userGuid, channelGuid, name) => dispatch(updateChannel(userGuid, channelGuid, name)),
        deleteChannel: (userGuid, channelGuid) => dispatch(deleteChannel(userGuid, channelGuid))
    };
}

const mapStateToProps = state => {
    const {channelReducer} = state;
    const {channelController} = channelReducer;
    const {result, newChannel, channels} = channelController;
    return {
        result: result,
        newChannel: newChannel,
        channels: channels,
        currentUser: state.authReducer.authController.currentUser
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskForum);
