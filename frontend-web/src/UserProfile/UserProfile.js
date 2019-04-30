import React from 'react'
import {
    Grid,
    Header,
    Image, List,
    Button, Item
} from 'semantic-ui-react'

import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'

import SteveImage from '../Images/matthew_nuezrz.png'
import {createStore} from "redux";
import reducer from "./reducers"
import {connect} from "react-redux";
import {fetchProfile, fetchProjects} from "./actions";
import LoaderInlineCentered from "../Common/Loader";


class UserProfile extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { userguid } = this.props.match.params;
        console.log(userguid);
        //this.props.fetchProjects();
        this.props.fetchProfile(userguid);
    }


    ProfileHeader() {
        if (this.props.profile.profileContent === null || this.props.profile.profileContent === undefined) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            )
        } else {
            return (
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
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
        }
    }

    ProjectList(projectList) {
        if (projectList.size() > 0) {
            return (
                <div>
                    <Item.Group link>
                        {projectList.map((item, index) => (
                            <Item key={index} item={item} >
                                <Item.Image size='tiny' src='https://react.semantic-ui.com/images/wireframe/image.png' />
                                <Item.Content>
                                    <Item.Header>item.name</Item.Header>
                                    <Item.Description>item.description</Item.Description>
                                </Item.Content>
                            </Item>
                        ))}
                    </Item.Group>
                </div>
            );
        } else {
            return (
                <div>

                </div>
            )
        }
    }

    render() {
        return (
            <div>
                <TopNavBar/>
                {this.ProfileHeader()}
                <Grid divided='vertically' style={{ marginTop: '5em' }} centered>
                    <Grid.Row columns={3} divided >
                        <Grid.Column centered >
                            <Header as='h2' style={{ 'text-align': 'center' }}>Highlights</Header>
                            <List animated divided verticalAlign='middle'>

                            </List>
                        </Grid.Column>
                        <Grid.Column centered>
                            <Header as='h2' style={{ 'text-align': 'center' }}>Current Projects</Header>
                            <p>This is a basic fixed menu template using fixed size containers.</p>
                            <p>
                                A text container is used for the main container, which is useful for single column layouts.
                            </p>
                        </Grid.Column>

                        <Grid.Column>
                            <Header as='h2' style={{ 'text-align': 'center' }}>Complete Projects</Header>
                            <p>This is a basic fixed menu template using fixed size containers.</p>
                            <p>
                                A text container is used for the main container, which is useful for single column layouts.
                            </p>
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
        fetchProjects: () => dispatch(fetchProjects()),
        fetchProfile: (guid) => dispatch(fetchProfile(guid))
    };
}

const mapStateToProps = state => {
    return {
        profile: state.profilePage.profile,
        projects: state.profilePage.projects
    }
};

const ProfilePage = connect(mapStateToProps, mapDispatchToProps) (UserProfile);
export default ProfilePage;