import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, Label, Menu, Input, Button, Icon, Card, Modal, List, Comment, Form
} from 'semantic-ui-react'
import {connect} from "react-redux";
import {createChannel, updateChannel, deleteChannel, getAllChannels} from "./channelActions";
import ChannelList from "./Channels/ChannelList";
import ChannelMessageList from "./Messages/ChannelMessageList";

const getHeaderStyle = () => ({
    padding: 12
});

class TaskForum extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedChannel: null,
            channels: this.props.channels,
            loadingChannels: true
        };
    }

    componentDidMount() {
        const {currentUser, task} = this.props;
        // Get all channels
        this.setState({loadingChannels: true});
        this.props.getChannels(currentUser.guid, task.guid).then(() => {
            // this.setState({selectedChannel: this.state.channels[0]})
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

    render() {
        const {task} = this.props;
        return (
            <div style={{overflow: 'auto', height: 800 }}>
                <Grid celled>
                    <Grid.Row color='black'>
                        <Header
                            as='h3'
                            style={getHeaderStyle()}
                            inverted>
                            {task.name}
                        </Header>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column width={5} style={{overflow: 'auto', height: 700 }}>
                            {this.channels()}
                        </Grid.Column>
                        <Grid.Column width={11}>
                            {this.messages()}
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
