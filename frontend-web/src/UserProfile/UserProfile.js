import React from 'react'
import {
    Grid,
    Header,
    Image, List,
    Button, Item, Modal, TransitionablePortal
} from 'semantic-ui-react'

import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'

import SteveImage from '../Images/matthew_nuezrz.png'
import {createStore} from "redux";
import reducer from "./reducers"
import {connect} from "react-redux";
import {fetchProfile, fetchProjects} from "./actions";
import LoaderInlineCentered from "../Common/Loader";
import NewProjectForm from "../Project/ModalForm";
import {postProject} from "../actions";
import { Route } from 'react-router-dom';


class UserProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            submitButtonDisabled: true
        };
    }

    showModal = () => {
        this.setState({
            modalVisible: true
        });
    };

    closeModal = () => {
        this.setState({
            modalVisible: false
        });
    };

    handleModalSubmit = () => {
        const { userguid } = this.props.match.params;
        this.props.postProject(userguid, this.props.values);
        this.setState({
            modalVisible: false
        });

    };

    componentDidUpdate(oldProps) {
        const newProps = this.props;
        if(oldProps.values !== newProps.values) {
            const values = newProps.values;
            if((typeof values !== 'undefined') && ((values.hasOwnProperty('projectNameInput')) && (values.hasOwnProperty('descriptionInput'))
                && (values.hasOwnProperty('tags')) && (values.hasOwnProperty('taskList') && ((values.hasOwnProperty('startDateInput')) &&
                    (/(\d+)(-|\/)(\d+)(?:-|\/)(?:(\d+)\s+(\d+):(\d+)(?::(\d+))?(?:\.(\d+))?)?/.test(values.startDateInput)))))) {
                this.setState({
                    submitButtonDisabled: false
                })
            }

        }
    }

    componentDidMount() {
        const { userguid } = this.props.match.params;
        this.props.fetchProfile(userguid);
        this.props.fetchProjects(userguid);
    }


    ProfileHeader() {
        if(typeof this.props.result !== 'undefined') {
            const { userguid } = this.props.match.params;
            this.props.history.push(`/profile/${userguid}/project/${this.props.result}`)
        }
        else if (this.props.profile.profileContent === null || this.props.profile.profileContent === undefined) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            )
        } else {
            return (
                <div>
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <Grid.Row columns={2}>
                        <Grid.Column width={2}>
                            <Image style={{'border-radius': 8}} src={SteveImage} size='small'/>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Header as='h1'>{this.props.profile.profileContent.firstName}</Header>
                            <p style={{fontSize: 16}}>Joined on {this.props.profile.profileContent.dateJoined}</p>
                            <p style={{fontSize: 22}}><i>"{this.props.profile.profileContent.profileBio}"</i></p>
                            <div>
                                <Button primary>Follow</Button>
                                <Button secondary>Message</Button>
                                <Button onClick={this.showModal}>Create Project</Button>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                    <TransitionablePortal open={this.state.modalVisible}
                                          transition={{animation: 'fade up', duration: 500}}>
                        <Modal open={true} onClose={this.closeModal} closeIcon>
                            <Modal.Header>Create a New Project</Modal.Header>
                            <Modal.Content>
                                <NewProjectForm/>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button
                                    positive
                                    icon='checkmark'
                                    labelPosition='right'
                                    content="All good to go!"
                                    onClick={this.handleModalSubmit}
                                    disabled={this.state.submitButtonDisabled}
                                />
                            </Modal.Actions>
                        </Modal>
                    </TransitionablePortal>
                </div>
            )
        }
    }


    ProjectList() {
        if (this.props.projects.items === undefined || this.props.projects.items === null ) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            )
        } else {
            const { userguid } = this.props.match.params;
            return (
                <div>
                    <Item.Group link>
                        {this.props.projects.items.map((item, index) => (
                            <Route render={({ history }) => (
                                <Item key={index} item={item} onClick={() => { history.push(`/profile/${userguid}/project/${item.guid}/`) }}>
                                    <Item.Image size='tiny' src='https://react.semantic-ui.com/images/wireframe/image.png' />
                                    <Item.Content>
                                        <Item.Header>{item.name}</Item.Header>
                                        <Item.Description>{item.description}</Item.Description>
                                    </Item.Content>
                                </Item>
                            )} />
                        ))}
                    </Item.Group>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                <TopNavBar/>
                {this.ProfileHeader()}
                <Grid divided='vertically' style={{ marginTop: '5em' }} centered>
                    <Grid.Row columns={2} divided >
                        <Grid.Column centered >
                            <Header as='h2' style={{ 'text-align': 'center' }}>Highlights</Header>
                        </Grid.Column>
                        <Grid.Column centered>
                            <Header as='h2' style={{ 'text-align': 'center' }}>Projects</Header>
                            {this.ProjectList()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Footer/>
            </div>
        )
    }

}



function mapDispatchToProps(dispatch) {
    return {
        fetchProjects: (guid) => dispatch(fetchProjects(guid)),
        fetchProfile: (guid) => dispatch(fetchProfile(guid)),
        postProject: (guid, values) => dispatch(postProject(guid, values))
    };
}

const mapStateToProps = state => {
    const { createProjectController } = state;
    const { isPosting, lastUpdated, result } = createProjectController;
    return state.form.newProject
        ? {
            values: state.form.newProject.values,
            submitSucceeded: state.form.newProject.submitSucceeded,
            isPosting: isPosting,
            result: result,
            lastUpdated: lastUpdated,
            profile: state.profilePage.profile,
            projects: state.profilePage.projects
        }
        : {
            profile: state.profilePage.profile,
            projects: state.profilePage.projects
        };
};

const ProfilePage = connect(mapStateToProps, mapDispatchToProps) (UserProfile);
export default ProfilePage;