import React from 'react'
import {
    Button, Modal, Icon, Form, TextArea, Progress, Divider, Dropdown, Input, Image, Segment, Grid, Header, Label, Comment, Confirm, GridColumn
} from 'semantic-ui-react'
import {connect} from "react-redux";
import CommentList from "./CommentList";
import {deleteComment} from "./actions";
import LoaderInlineCentered from "../Common/Loader";

class ProjectUpdateCommentList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            comments: this.props.comments
        };
    }

    readMessageString = () => {
      return "new comment";
    };

    createComment = () => {
        let message = this.readMessageString();
    };

    deleteCommentCallback = (comment) => {
        const { currentUser } = this.props;
        const { comments } = this.state;

        // Delete comment request
        this.props.deleteComment(currentUser.guid, comment.guid);

        // Remove from state
        let index = comments.indexOf(comment);
        if (index !== -1) {
            comments.splice(index, 1);
            this.setState({comments: comments})
        }
    };

    addCommentForm = () => {
        return (
            <Form reply>
                <Grid>
                    <GridColumn width={12}>
                        <TextArea rows={1} placeholder='Add a comment...' />
                    </GridColumn>

                    <GridColumn width={3}>
                        <Button content='Add' primary />
                    </GridColumn>
                </Grid>
            </Form>
        );
    };

    render() {
        const { currentUser } = this.props;
        const { comments } = this.state;
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
                    {/*<Form reply>*/}
                    {/*    <Form.TextArea />*/}
                    {/*    <Button content='Add Comment' labelPosition='left' icon='edit' primary />*/}
                    {/*</Form>*/}
                    {this.addCommentForm()}
                </Comment.Group>
            );
        }
        else {
            return(
                <div>
                    <CommentList
                        comments={comments}
                        currentUser={currentUser}
                        deleteCommentCallback={this.deleteCommentCallback}
                    />
                    {this.addCommentForm()}
                </div>
            );
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteComment: (userGuid, updateGuid) => dispatch(deleteComment(userGuid, updateGuid))
    };
}

const mapStateToProps = state => {
    const { projectUpdateCommentReducer } = state;
    const { commentController } = projectUpdateCommentReducer;
    const { result  } = commentController;
    return {
        result: result
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectUpdateCommentList);