import React from 'react'
import {Button, Comment, Confirm, Input, Segment} from 'semantic-ui-react'
import {Route} from 'react-router-dom';
import Moment from 'moment';

class MessageItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: this.props.message,
            confirmDeleteOpen: false,
            editing: false,
            newText: ''
        };
    }

    startEdit = () => {
        const {message} = this.state;
        this.setState({editing: true});
        this.setState({newText: message.text});
    };

    updateText = (e, {value}) => {
        this.setState({newText: value});
    };

    enter = (e) => {
        if (e.key === 'Enter') {
            this.edit();
        }
    };

    edit = () => {
        const {message, newText} = this.state;

        if (newText.trim().length !== 0) {
            // Edit message callback
            this.props.editMessageCallback(newText, message)
            // Update state
                .then(() => {
                    this.setState({editing: false});
                    message.text = newText;
                    this.setState({message: message});
                });
        }
    };

    cancelDelete = () => this.setState({confirmDeleteOpen: false});

    confirmDelete = () => {
        const {message} = this.state;
        this.setState({confirmDeleteOpen: false});
        this.props.deleteMessageCallback(message);
    };

    showDeleteModal = () => this.setState({confirmDeleteOpen: true});

    getConfirmDelete = () => {
        const {confirmDeleteOpen} = this.state;

        return (
            <Confirm
                open={confirmDeleteOpen}
                content='Are you sure you want to delete this message?'
                header='Delete Message'
                cancelButton='No'
                confirmButton="Yes"
                onCancel={this.cancelDelete}
                onConfirm={this.confirmDelete}
            />
        );
    };

    getText() {
        const {message} = this.state;
        const {text} = message;

        if (this.state.editing) {
            return (
                <Input
                    size='small'
                    onChange={this.updateText}
                    onKeyDown={this.enter}
                    action
                    defaultValue={text}
                >
                    <input/>
                    <Button icon='check' onClick={this.edit} size='medium'/>
                </Input>
            )
        } else {
            return (
                <Comment.Text onClick={this.startEdit}>{text}</Comment.Text>
            );
        }
    }

    getActions() {
        const {message} = this.state;
        const {currentUser} = this.props;

        if (currentUser.guid === message.author.guid) {
            return (
                <Comment.Actions>
                    <Comment.Action onClick={this.startEdit}>Edit</Comment.Action>
                    <Comment.Action onClick={this.showDeleteModal}>Delete</Comment.Action>
                </Comment.Actions>
            );
        }
    }

    leftAlignedMessage() {
        const {message} = this.state;
        const {guid, sent, author} = message;

        const dateTime = new Date(sent);
        const momentTime = Moment(dateTime).calendar();
        return (
            <Segment>
                <Comment key={guid}>
                    <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg'/>
                    <Comment.Content>
                        <Route render={({history}) => (
                            <Comment.Author as='a' onClick={() => {
                                history.push(`/profile/${author.guid}/`)
                            }}> {author.firstName}
                            </Comment.Author>
                        )}/>
                        <Comment.Metadata>
                            <div>{momentTime}</div>
                        </Comment.Metadata>
                        {this.getText()}
                        {this.getActions()}
                    </Comment.Content>
                </Comment>
                {this.getConfirmDelete()}
            </Segment>
        );


    }

    rightAlignedMessage() {
        const {message} = this.state;
        const {guid, sent, author} = message;

        const dateTime = new Date(sent);
        const momentTime = Moment(dateTime).calendar();
        return (
            <Segment>
                <Comment key={guid}>
                    <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg'/>
                    <Comment.Content>
                        <Route render={({history}) => (
                            <Comment.Author as='a' onClick={() => {
                                history.push(`/profile/${author.guid}/`)
                            }}> {author.firstName}
                            </Comment.Author>
                        )}/>
                        <Comment.Metadata>
                            <div>{momentTime}</div>
                        </Comment.Metadata>
                        {this.getText()}
                        {this.getActions()}
                    </Comment.Content>
                </Comment>
                {this.getConfirmDelete()}
            </Segment>
        );
    }

    // message(alignment) {
    //     const {message} = this.state;
    //     const {guid, sent, author} = message;
    //
    //     const dateTime = new Date(sent);
    //     const momentTime = Moment(dateTime).calendar();
    //     return (
    //         <Segment>
    //             <Comment key={guid}>
    //                 <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg'/>
    //                 <Comment.Content>
    //                     <Route render={({history}) => (
    //                         <Comment.Author as='a' onClick={() => {
    //                             history.push(`/profile/${author.guid}/`)
    //                         }}> {author.firstName}
    //                         </Comment.Author>
    //                     )}/>
    //                     <Comment.Metadata>
    //                         <div>{momentTime}</div>
    //                     </Comment.Metadata>
    //                     {this.getText()}
    //                     {this.getActions()}
    //                 </Comment.Content>
    //             </Comment>
    //             {this.getConfirmDelete()}
    //         </Segment>
    //     );
    //
    // }

    render() {
        const {message} = this.state;
        const {currentUser} = this.props;
        if (currentUser.guid === message.author.guid) {
            return (
                <div>
                    {this.rightAlignedMessage()}
                </div>
        );
        } else {
            return (
                <div>
                    {this.leftAlignedMessage()}
                </div>
            );
        }
    }
}

export default MessageItem;