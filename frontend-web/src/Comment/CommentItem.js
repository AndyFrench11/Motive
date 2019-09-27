import React from 'react'
import {Button, Comment, Confirm, Input} from 'semantic-ui-react'
import {Route} from 'react-router-dom';
import Moment from 'moment';

class CommentItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            comment: this.props.comment,
            confirmDeleteOpen: false,
            editing: false,
            newMessage: ''
        };
    }

    startEdit = () => {
        const {comment} = this.state;
        this.setState({editing: true});
        this.setState({newMessage: comment.message});
    };

    updateMessage = (e, {value}) => {
        this.setState({newMessage: value});
    };

    enter = (e) => {
        if (e.key === 'Enter') {
            this.edit();
        }
    };

    edit = () => {
        const {comment, newMessage} = this.state;

        if (newMessage.trim().length !== 0) {
            // Edit comment callback
            this.props.editCommentCallback(newMessage, comment)
            // Update state
                .then(() => {
                    this.setState({editing: false});
                    comment.message = newMessage;
                    this.setState({comment: comment});
                });
        }
    };

    cancelDelete = () => this.setState({confirmDeleteOpen: false});

    confirmDelete = () => {
        const {comment} = this.state;
        this.setState({confirmDeleteOpen: false});
        this.props.deleteCommentCallback(comment);
    };

    showDeleteModal = () => this.setState({confirmDeleteOpen: true});

    getConfirmDelete = () => {
        const {confirmDeleteOpen} = this.state;

        return (
            <Confirm
                open={confirmDeleteOpen}
                content='Are you sure you want to delete this comment?'
                header='Delete Comment'
                cancelButton='No'
                confirmButton="Yes"
                onCancel={this.cancelDelete}
                onConfirm={this.confirmDelete}
            />
        );
    };

    getText() {
        const {comment} = this.state;
        const {message} = comment;

        if (this.state.editing) {
            return (
                <Input
                    size='small'
                    onChange={this.updateMessage}
                    onKeyDown={this.enter}
                    action
                    defaultValue={message}
                >
                    <input/>
                    <Button icon='check' onClick={this.edit} size='medium'/>
                </Input>
            )
        } else {
            return (
                <Comment.Text onClick={this.startEdit}>{message}</Comment.Text>
            );
        }
    }

    getActions() {
        const {comment} = this.state;
        const {currentUser} = this.props;

        if (currentUser.guid === comment.author.guid) {
            return (
                <Comment.Actions>
                    <Comment.Action onClick={this.startEdit}>Edit</Comment.Action>
                    <Comment.Action onClick={this.showDeleteModal}>Delete</Comment.Action>
                </Comment.Actions>
            );
        }
    }

    render() {
        const {comment} = this.state;
        const {guid, authored, author} = comment;

        const dateTime = new Date(authored);
        const momentTime = Moment(dateTime).calendar();

        return (
            <div>
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
            </div>
        );
    }
}

export default CommentItem;