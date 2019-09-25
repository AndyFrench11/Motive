import React from 'react'
import {
    Button, Modal, Icon, Form, TextArea, Progress, Divider, Dropdown, Input, Image, Segment, Grid, Header, Label, Comment, Confirm
} from 'semantic-ui-react'
import {connect} from "react-redux";
import CommentList from "./CommentList";
import {fetchComments} from "./actions";
import LoaderInlineCentered from "../Common/Loader";

class ProjectUpdateCommentList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
        const { updateGuid, userGuid } = this.props;
        this.props.fetchComments(userGuid, updateGuid);
    }

    render() {
        const { isUpdating, comments } = this.props;
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
                />
            );
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchComments: (userGuid, updateGuid) => dispatch(fetchComments(userGuid, updateGuid))
    };
}

const mapStateToProps = state => {
    const { projectUpdateCommentReducer } = state;
    const { commentController } = projectUpdateCommentReducer;
    const { isRetrievingComments, comments  } = commentController;
    return {
        isUpdating: isRetrievingComments,
        comments: comments
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectUpdateCommentList);