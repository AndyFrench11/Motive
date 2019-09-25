import React from 'react'
import {
    Button, Form, Grid, Comment} from 'semantic-ui-react'
import CommentItem from "./CommentItem";
import LoaderInlineCentered from "../Common/Loader";

class CommentList extends React.Component {

    constructor(props) {
        super(props);
    }

    /// Methods go here
    // handleDeleteComment = () => {
    //
    // }

    render() {
        const { comments, currentUser } = this.props;

        if (comments === null || comments === undefined) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            );
        }
        else if (comments.length === 0) {
            return (
                <Comment.Group>
                    <Form reply>
                        <Form.TextArea />
                        <Button content='Add Comment' labelPosition='left' icon='edit' primary />
                    </Form>
                </Comment.Group>
            )
        } else {
            return (
                <Comment.Group minimal>
                    {comments.map((comment) => (
                        <CommentItem
                            comment={comment}
                            currentUser={currentUser}
                            deleteCommentCallback={this.props.deleteCommentCallback}
                        />
                    ))}
                    <Form reply>
                        <Form.TextArea />
                        <Button content='Add Reply' labelPosition='left' icon='edit' primary />
                    </Form>
                </Comment.Group>
            );
        }
    }
}

export default CommentList;