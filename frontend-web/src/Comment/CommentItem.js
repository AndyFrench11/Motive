import React from 'react'
import {
    Button, Modal, Icon, Form, TextArea, Progress, Divider, Dropdown, Input, Image, Segment, Grid, Header, Label, Comment, Confirm
} from 'semantic-ui-react'

class CommentItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { comment } = this.props;
        const { guid, message, authored, author } = comment;

        return (
            <Comment key={guid}>
                <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                <Comment.Content>
                    <Comment.Author as='a'>{author.firstName}</Comment.Author>
                    <Comment.Metadata>
                        <div>{authored}</div>
                    </Comment.Metadata>
                    <Comment.Text>{message}</Comment.Text>
                    <Comment.Actions>
                        <Comment.Action>Edit</Comment.Action>
                        <Comment.Action>Delete</Comment.Action>
                    </Comment.Actions>
                </Comment.Content>
            </Comment>
        );
    }
}

export default CommentItem;