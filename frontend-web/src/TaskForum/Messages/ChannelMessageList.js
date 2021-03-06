import React from 'react'
import {
    Form,
    Grid,
    Comment,
    GridColumn,
    Header,
    Segment,
    Divider,
    Icon,
    Button
} from 'semantic-ui-react'
import {connect} from "react-redux";
import {deleteMessage, createMessage, updateMessage, getAllMessages} from "./messageActions";
import LoaderInlineCentered from "../../Common/Loader";
import MessageList from "./MessageList";

class ChannelMessageList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: this.props.messages,
            messageText: '',
            loading: true
        };
    }

    componentDidMount() {
        const {currentUser, channel} = this.props;
        // Fetch all messages
        this.setState({loading: true});
        this.props.getMessages(currentUser.guid, channel.guid).then(() => {
            this.setState({messages: this.props.messages});
            this.setState({loading: false});
        });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        let previousChannel = prevProps.channel;
        const {currentUser, channel} = this.props;

        if (previousChannel !== channel) {
            // Fetch all messages
            this.setState({loading: true});
            this.props.getMessages(currentUser.guid, channel.guid).then(() => {
                this.setState({messages: this.props.messages});
                this.setState({loading: false});
            });
        }
    };

    handleChange = (e, {name, value}) => {
        this.setState({[name]: value})
    };

    enter = (e) => {
        if (e.key === 'Enter') {
            this.sendMessage();
        }
    };

    sendMessage = () => {
        const {currentUser, channel} = this.props;
        const {messageText} = this.state;

        // Check text is not empty
        if (messageText.trim().length !== 0) {
            // Create message request
            this.props.addMessage(currentUser.guid, channel.guid, messageText)
                .then(() => {
                    // Add to state
                    this.setState(previous => ({messages: [...previous.messages, this.props.newMessage]}));
                    // If successful, clear the text area
                    this.setState({messageText: ''})
                });
        }
    };

    editMessageCallback = (newText, message) => {
        const {currentUser} = this.props;

        // Edit message request
        return this.props.editMessage(currentUser.guid, message.guid, newText);
    };

    deleteMessageCallback = (message) => {
        const {currentUser} = this.props;
        const {messages} = this.state;

        // Delete message request
        this.props.deleteMessage(currentUser.guid, message.guid)
            .then(() => {
                // Remove from state
                let index = messages.indexOf(message);
                if (index !== -1) {
                    messages.splice(index, 1);
                    this.setState({messages: messages})
                }
            });
    };

    addMessageForm = () => {
        const {messageText} = this.state;
        return (
            <Form reply
                  onSubmit={this.sendMessage}
            >
                <Grid>
                    <GridColumn width={12}>
                        <Form.TextArea
                            name='messageText'
                            value={messageText}
                            rows={1}
                            placeholder='Write a message...'
                            onChange={this.handleChange}
                            onKeyDown={this.enter}
                        />
                    </GridColumn>

                    <GridColumn width={3}>
                        <Form.Button
                            content='Send'
                            primary/>
                    </GridColumn>
                </Grid>
            </Form>
        );
    };

    content() {
        const {currentUser} = this.props;
        const {messages, loading} = this.state;

        if (loading || messages === null || messages === undefined) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            );
        } else if (messages.length === 0) {
            return (
                <div>
                    <Segment placeholder style={{overflow: 'auto', height: 400 }}>
                        <Header icon>
                            <Icon name='envelope outline' />
                            No messages for this channel yet!
                        </Header>
                    </Segment>
                    <Divider horizontal/>
                    {this.addMessageForm()}
                </div>
            );
        } else {
            return (
                <div>
                    <Segment style={{overflow: 'auto', height: 400 }}>
                        <MessageList
                            messages={messages}
                            currentUser={currentUser}
                            deleteMessageCallback={this.deleteMessageCallback}
                            editMessageCallback={this.editMessageCallback}
                        />
                    </Segment>
                    <Divider horizontal/>
                    {this.addMessageForm()}
                </div>
            );
        }

    };

    render() {
        const {channel} = this.props;

        return (
            <div>
                <Divider horizontal>
                    <Header as='h4'>
                        <Icon name='newspaper outline'/>
                        {channel.name}
                    </Header>
                </Divider>
                {this.content()}
            </div>

        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addMessage: (userGuid, channelGuid, messageText) => dispatch(createMessage(userGuid, channelGuid, messageText)),
        getMessages: (userGuid, channelGuid) => dispatch(getAllMessages(userGuid, channelGuid)),
        editMessage: (userGuid, messageGuid, messageText) => dispatch(updateMessage(userGuid, messageGuid, messageText)),
        deleteMessage: (userGuid, messageGuid) => dispatch(deleteMessage(userGuid, messageGuid))
    };
}

const mapStateToProps = state => {
    const {channelMessageReducer} = state;
    const {messageController} = channelMessageReducer;
    const {result, newMessage, messages} = messageController;
    return {
        result: result,
        newMessage: newMessage,
        messages: messages,
        currentUser: state.authReducer.authController.currentUser
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChannelMessageList);