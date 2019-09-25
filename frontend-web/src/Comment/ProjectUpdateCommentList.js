import React from 'react'
import {
    Button, Modal, Icon, Form, TextArea, Progress, Divider, Dropdown, Input, Image, Segment, Grid, Header, Label, Comment, Confirm
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

    render() {
        const { currentUser } = this.props;
        const { comments } = this.state;
        if (comments === null || comments === undefined) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            )
        } else {
            return(
                <CommentList
                    comments={comments}
                    currentUser={currentUser}
                    deleteCommentCallback={this.deleteCommentCallback}
                />
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