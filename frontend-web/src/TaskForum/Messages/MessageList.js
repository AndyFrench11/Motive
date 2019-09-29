import React from 'react'
import {
    Grid, Comment, Header
} from 'semantic-ui-react'
import LoaderInlineCentered from "../../Common/Loader";
import MessageItem from "./MessageItem";

class MessageList extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {messages, currentUser} = this.props;

        if (messages === null || messages === undefined) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            );
        } else if (messages.length === 0) {
            return (
                <Comment.Group>
                    <Header as='h3' dividing>
                        No Messages for this Channel!
                    </Header>
                </Comment.Group>
            )
        } else {
            return (
                <Comment.Group minimal>
                    {messages.map((message) => (
                        <MessageItem
                            key={message.guid}
                            message={message}
                            currentUser={currentUser}
                            deleteMessageCallback={this.props.deleteMessageCallback}
                            editMessageCallback={this.props.editMessageCallback}
                        />
                    ))}
                </Comment.Group>
            );
        }
    }
}

export default MessageList;