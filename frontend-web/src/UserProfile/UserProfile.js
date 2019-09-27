import React from 'react'
import {
    Grid,
    Header,
    Image, List,
    Button, Item, Modal, TransitionablePortal, Segment, Divider
} from 'semantic-ui-react'

import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'

import SteveImage from '../Images/matthew_nuezrz.png'
import {createStore} from "redux";
import reducer from "./reducers"
import {connect} from "react-redux";
import {fetchProfile, fetchProjects} from "./actions";
import LoaderInlineCentered from "../Common/Loader";
import NewProjectForm from "../Project/CreateNewProject/ModalForm";
import {postProject} from "../Project/actions";
import { Route } from 'react-router-dom';
import UserProjectList from "./UserProjectList";

function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

const images = importAll(require.context('../Project/ProjectImages', false, /\.(png|jpe?g|svg)$/));


class UserProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
        const { userguid } = this.props.match.params;
        this.props.fetchProfile(userguid);
        this.props.fetchProjects(userguid);
    }

    // if(typeof this.props.result !== 'undefined') {
    //     //Causing issues
    //     //this.props.history.push(`/project/${this.props.result}`)
    // }
    // else 

    ProfileHeader() {
        
        if (this.props.profile.profileContent === null || this.props.profile.profileContent === undefined) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            )
        } else {
            const dateJoined = new Date(this.props.profile.profileContent.dateJoined);
            const formattedDate = dateJoined.toLocaleDateString("en-NZ");
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <Grid.Row columns={2}>
                        <Grid.Column width={2}>
                            <Image style={{'border-radius': 8}} src={SteveImage} size='small'/>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Header as='h1'>{this.props.profile.profileContent.firstName} {this.props.profile.profileContent.lastName}</Header>
                            <p style={{fontSize: 16}}>Joined on {formattedDate}</p>
                            {/* <p style={{fontSize: 22}}><i>"{this.props.profile.profileContent.profileBio}"</i></p> */}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
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
                <UserProjectList projects={this.props.projects.items} userGuid={userguid}/>
            )

        }
    }

    render() {
        return (
            <div>
                <TopNavBar/>
                {this.ProfileHeader()}
                <Grid divided='vertically' style={{ marginTop: '5em' }} centered>
                    <Grid.Row columns={1} divided >
                        <Grid.Column centered>
                            <Header as='h2' style={{ 'text-align': 'center' }}>Projects</Header>
                            <Divider/>
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
        fetchProfile: (guid) => dispatch(fetchProfile(guid))
    };
}

const mapStateToProps = state => {
    const { createProjectController } = state;
    const { isPosting, lastUpdated, result } = createProjectController;
    return state.form.newProject
        ? {
            values: state.form.newProject.values,
            submitSucceeded: state.form.newProject.submitSucceeded,
            isSigningIn: isPosting,
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