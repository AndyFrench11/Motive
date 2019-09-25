import React from 'react'
import {Comment, Confirm, Item, Segment} from 'semantic-ui-react'
import { Route } from 'react-router-dom';

class CommentItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          confirmDeleteOpen: false
        };
    }

    cancelDelete = () => this.setState({confirmDeleteOpen: false});

    confirmDelete = () => {
        const { comment } = this.props;
        this.setState({confirmDeleteOpen: false});
        this.props.deleteCommentCallback(comment);
    };

    showDeleteModal = () => this.setState({confirmDeleteOpen: true});

    getConfirmDelete = () => {
        const { confirmDeleteOpen } = this.state;

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

    getActions() {
        const { comment, currentUser} = this.props;

        if (currentUser.guid === comment.author.guid) {
            return (
                <Comment.Actions>
                    <Comment.Action>Edit</Comment.Action>
                    <Comment.Action onClick={this.showDeleteModal}>Delete</Comment.Action>
                </Comment.Actions>
            );
        }
    }

    render() {
        const { comment } = this.props;
        const { guid, message, authored, author } = comment;

        return (
            <Segment>
                <Comment key={guid}>
                    <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                    <Comment.Content>
                        <Route render={({ history }) => (
                            <Comment.Author as='a' onClick={() => { history.push(`/profile/${author.guid}/`) }}> {author.firstName}
                            </Comment.Author>
                        )} />
                        <Comment.Metadata>
                            <div>{authored}</div>
                        </Comment.Metadata>
                        <Comment.Text>{message}</Comment.Text>
                        {this.getActions()}
                    </Comment.Content>
                </Comment>
                {this.getConfirmDelete()}
            </Segment>
        );
    }
}

export default CommentItem;