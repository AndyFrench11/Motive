import React from 'react'
import {
    Button,
    Modal,
    Icon,
    Form,
    TextArea,
    Progress,
    Divider,
    Dropdown,
    Input,
    Image,
    Segment,
    Grid,
    Header,
    Label,
    Comment,
    Confirm,
    GridColumn
} from 'semantic-ui-react'
import {connect} from "react-redux";
import CommentList from "./CommentList";
import {deleteComment, createComment, updateComment} from "./actions";
import LoaderInlineCentered from "../Common/Loader";

class ProjectUpdateCommentList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            comments: this.props.comments,
            messageString: ''
        };
    }

    handleChange = (e, {name, value}) => {
        this.setState({[name]: value})
    };

    enter = (e) => {
        if (e.key === 'Enter') {
            this.createComment();
        }
    };

    createComment = () => {
        const {currentUser, update} = this.props;
        const {messageString} = this.state;

        // Create comment request
        this.props.addComment(currentUser.guid, update.guid, messageString)
            .then(() => {
                // Add to state
                this.setState(previous => ({comments: [...previous.comments, this.props.newComment]}));
                // If successful, clear the text area
                this.setState({messageString: ''})
            });
    };

    editCommentCallback = (newMessage, comment) => {
        const {currentUser} = this.props;

        // Edit comment request
        return this.props.editComment(currentUser.guid, comment.guid, newMessage);
    };

    deleteCommentCallback = (comment) => {
        const {currentUser} = this.props;
        const {comments} = this.state;

        // Delete comment request
        this.props.deleteComment(currentUser.guid, comment.guid)
            .then(() => {
                // Remove from state
                let index = comments.indexOf(comment);
                if (index !== -1) {
                    comments.splice(index, 1);
                    this.setState({comments: comments})
                }
            });
    };

    addCommentForm = () => {
        const {messageString} = this.state;
        return (
            <Form reply onSubmit={this.createComment}>
                <Grid>
                    <GridColumn width={12}>
                        <Form.TextArea
                            name='messageString'
                            value={messageString}
                            rows={1}
                            placeholder='Add a comment...'
                            onChange={this.handleChange}
                            onKeyDown={this.enter}
                        />
                    </GridColumn>

                    <GridColumn width={3}>
                        <Form.Button
                            content='Add'
                            primary/>
                    </GridColumn>
                </Grid>
            </Form>
        );
    };

    render() {
        const {currentUser} = this.props;
        const {comments} = this.state;
        if (comments === null || comments === undefined) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            );
        } else if (comments.length === 0) {
            return (
                <Comment.Group>
                    {this.addCommentForm()}
                </Comment.Group>
            );
        } else {
            return (
                <div>
                    <CommentList
                        comments={comments}
                        currentUser={currentUser}
                        deleteCommentCallback={this.deleteCommentCallback}
                        editCommentCallback={this.editCommentCallback}
                    />
                    {this.addCommentForm()}
                </div>
            );
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        addComment: (userGuid, updateGuid, messageString) => dispatch(createComment(userGuid, updateGuid, messageString)),
        editComment: (userGuid, commentGuid, messageString) => dispatch(updateComment(userGuid, commentGuid, messageString)),
        deleteComment: (userGuid, commentGuid) => dispatch(deleteComment(userGuid, commentGuid))
    };
}

const mapStateToProps = state => {
    const {projectUpdateCommentReducer} = state;
    const {commentController} = projectUpdateCommentReducer;
    const {result, newComment} = commentController;
    return {
        result: result,
        newComment: newComment
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectUpdateCommentList);