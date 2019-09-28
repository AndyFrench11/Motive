import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, Label, Menu, Input, Button, Icon, Card, Modal, List, Comment, Form
} from 'semantic-ui-react'
import {connect} from "react-redux";
import {createChannel, updateChannel, deleteChannel, getAllChannels} from "./channelActions";
import ChannelList from "./Channels/ChannelList";

const getHeaderStyle = () => ({
    padding: 12
});

class TaskForum extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedChannel: null,
            channels: this.props.channels
        };
    }

    componentDidMount() {
        const {currentUser, task} = this.props;
        console.log(task);
        // Get all channels
        this.props.getChannels(currentUser.guid, task.guid).then(() => {
            // this.setState({selectedChannel: this.state.channels[0]})
            this.setState({channels: this.props.channels})
        });
    }

    channels() {
        const {channels} = this.state;
        return (
            <ChannelList
                channels={channels}
            />
        )
    }

    messages() {
        const {selectedChannel} = this.state;
        if (selectedChannel === null) {
            return (
                <Header>
                    Please select a channel
                </Header>
            )
        } else {
            return (
                <Comment.Group>
                    <Comment>
                        <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                        <Comment.Content>
                            <Comment.Author>Joe Henderson</Comment.Author>
                            <Comment.Metadata>
                                <div>1 day ago</div>
                            </Comment.Metadata>
                            <Comment.Text>
                                <p>
                                    The hours, minutes and seconds stand as visible reminders that your
                                    effort put them all there.
                                </p>
                                <p>
                                    Preserve until your next run, when the watch lets you see how
                                    Impermanent your efforts are.
                                </p>
                            </Comment.Text>
                            <Comment.Actions>
                                <Comment.Action>Reply</Comment.Action>
                            </Comment.Actions>
                        </Comment.Content>
                    </Comment>

                    <Comment>
                        <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                        <Comment.Content>
                            <Comment.Author>Christian Rocha</Comment.Author>
                            <Comment.Metadata>
                                <div>2 days ago</div>
                            </Comment.Metadata>
                            <Comment.Text>I re-tweeted this.</Comment.Text>
                            <Comment.Actions>
                                <Comment.Action>Reply</Comment.Action>
                            </Comment.Actions>
                        </Comment.Content>
                    </Comment>
                    <Form reply>
                        <Form.TextArea />
                        <Button content='Add Comment' labelPosition='left' icon='edit' primary />
                    </Form>
                </Comment.Group>
            )
        }
    }

    render() {
        const {task} = this.props;
        return (
            <div>
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
                        <Grid.Column width={4}>
                            {this.channels()}
                        </Grid.Column>
                        <Grid.Column width={12}>
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
