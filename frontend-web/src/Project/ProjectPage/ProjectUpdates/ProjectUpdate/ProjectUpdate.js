import React from 'react'
import {
    Button, Modal, Icon, Form, TextArea, Progress, Divider, Dropdown, Input, Image, Segment, Grid, Header, Label, Comment, Confirm
} from 'semantic-ui-react'
import {connect} from "react-redux";
import uuidv4 from 'uuid/v4';
import TrophyImage from '../../../ProjectImages/image16.png';
import ProjectUpdateContent from './ProjectUpdateContent';
import { deleteProjectUpdate, updateProjectUpdateHighlight } from "./actions";
import ProjectUpdateCommentList from "../../../../Comment/ProjectUpdateCommentList";
import Moment from 'moment';

class ProjectUpdate extends React.Component {

    constructor(props) {
        super(props);

        this.state = { 
            updatingContent: false,
            deleteUpdateConfirmOpen: false,
            highlight: this.props.update.highlight
        };

    }

    handleEditUpdateClicked = () => {
        this.setState({ updatingContent: !this.state.updatingContent });

    };

    handleConfirmUpdateDeletion = () => {
        const { update } = this.props;
        this.setState({ deleteUpdateConfirmOpen: false });
        this.props.deleteUpdateCallback(this.props.index);
        this.props.deleteProjectUpdate(update.guid);
    };

    showDeleteUpdateConfirm = () => this.setState({ deleteUpdateConfirmOpen: true });

    handleCancelUpdateDeletion = () => this.setState({ deleteUpdateConfirmOpen: false });

    updateContentStateCallback = () => {
        this.setState({ updatingContent: false });
    };

    handleHighlightStatusChange = () => {
        const { highlight } = this.state;
        const { update } = this.props;
        this.setState({ highlight: !highlight });
        //Do backend call!
        this.props.updateProjectUpdateHighlight(update.guid, !highlight)

    };


    render() {

        const { update, projectName, tags, currentUser } = this.props;
        const { relatedPerson, relatedTask, content, dateTimeCreated, guid, comments } = update;

        const { deleteUpdateConfirmOpen, updatingContent, highlight } = this.state;

        const options = [
            { key: '1', text: 'Edit Update', icon: 'edit', onClick: this.handleEditUpdateClicked },
            { key: '2', text: 'Delete Update', icon: 'delete', onClick: this.showDeleteUpdateConfirm },
          ];

        if(highlight) {
            options.splice(1, 0, { key: '3', text: 'Unmark Update as Highlight', icon: 'heart', onClick: this.handleHighlightStatusChange });
        } else {
            options.splice(1, 0, { key: '3', text: 'Mark Update as Highlight', icon: 'heart', onClick: this.handleHighlightStatusChange });
        }

        const trigger = (
            <span>
                <Icon name='ellipsis horizontal' floated='right' />
            </span>
            );

        const dateTime = new Date(dateTimeCreated);
        const momentTime = Moment(dateTime).calendar();

        return (
            <Segment style={{'width': '80em', 'marginTop': '3em', 'marginLeft': '2em'}}>

                <Confirm
                    open={deleteUpdateConfirmOpen}
                    content='Are you sure you want to delete this update?'
                    header='Delete Update'
                    cancelButton='No'
                    confirmButton="Yes"
                    onCancel={this.handleCancelUpdateDeletion}
                    onConfirm={this.handleConfirmUpdateDeletion}
                    />

                <Grid columns='four' divided>
                    <Grid.Column width={2}>
                        {highlight &&
                            <Label floating color='red' circular icon="heart" size="massive" className="updateHighlight"/>
                            }   
                        <Image avatar src='https://react.semantic-ui.com/images/avatar/large/matthew.png' size="tiny"/>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Grid.Row>
                            <Header size='large'>Update from {relatedPerson.firstName}</Header>
                        </Grid.Row>
                        <Grid.Row style={{'marginTop': '1em'}}>
                            <Header size='tiny'>{momentTime}</Header>
                        </Grid.Row>

                    </Grid.Column>
                    <Grid.Column width={5}>
                        <Grid.Row>
                            <Header size='large'>{projectName}</Header>    
                        </Grid.Row>
                        <Grid.Row>
                            {tags.map((tag, index) =>
                                <Label key={index} >
                                    #{tags[index].name}
                                </Label>
                            )}
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column floated='right'>
                        <Label attached='top right'>
                            <Dropdown
                                trigger={trigger}
                                options={options}
                                pointing='top left'
                                icon={null}
                            />
                        </Label>
                    </Grid.Column>
                </Grid>
                <Divider/>
                <Grid columns='2' divided>
                    <Grid.Column width={10} fluid>
                        {relatedTask !== null && (
                            relatedTask.completed ? 
                                    <Grid.Row>
                                        <Segment>
                                            <Grid>
                                                <Grid.Column width={2}>
                                                    <Image src={TrophyImage} size='large' rounded />
                                                </Grid.Column>
                                                <Grid.Column width={10}>
                                                    <Header style={{'marginTop': 3}} size='medium'>Task Completed: {relatedTask.name}</Header>
                                                </Grid.Column>
                                            </Grid>
                                        </Segment>
                                    </Grid.Row>
                            :
                                    <Grid.Row>
                                        <Segment>
                                            <Grid>
                                                <Grid.Column width={2}>
                                                    <Icon size='large' name='tasks'/>
                                                </Grid.Column>
                                                <Grid.Column width={10}>
                                                    <Header style={{'marginTop': 3}} size='medium'>Task: {relatedTask.name}</Header>
                                                </Grid.Column>
                                            </Grid>
                                        </Segment>
                                    </Grid.Row>
                        )}
                        {relatedTask !== null &&
                            <Divider/>
                        }

                        <ProjectUpdateContent 
                            updateGuid={guid}
                            content={content} 
                            updatingContent={updatingContent} 
                            updateContentStateCallback={this.updateContentStateCallback}/>
                    </Grid.Column>
                    <Grid.Column width={6} floated="right">
                        <Segment style={{overflow: 'auto', maxHeight: 300 }}>
                            <ProjectUpdateCommentList
                                comments={comments}
                                currentUser={currentUser}
                            />
                            {/*<CommentList*/}
                            {/*    comments={comments}*/}
                            {/*/>*/}
                        </Segment> 
                    </Grid.Column>
                </Grid>

                <Divider/>

            </Segment>

        );
  }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteProjectUpdate: (updateGuid) => dispatch(deleteProjectUpdate(updateGuid)),
        updateProjectUpdateHighlight: (updateGuid, newHighlightStatus) => dispatch(updateProjectUpdateHighlight(updateGuid, newHighlightStatus))
    };
}

const mapStateToProps = state => {
    const { projectUpdateReducer } = state;
    const { projectUpdateController } = projectUpdateReducer;
    const { isUpdating, lastUpdated, result } = projectUpdateController;
    return {
        isUpdating: isUpdating,
        result: result,
        lastUpdated: lastUpdated,
        currentUser: state.authReducer.authController.currentUser
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectUpdate);
