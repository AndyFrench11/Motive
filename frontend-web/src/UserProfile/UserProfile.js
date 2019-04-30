import React from 'react'
import {
    Grid,
    Header,
    Image, List,
} from 'semantic-ui-react'

import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'

import SteveImage from '../Images/matthew_nuezrz.png'
import {createStore} from "redux";
import reducer from "./reducers"
import {connect} from "react-redux";
import {fetchProjects} from "./actions";

class UserProfile extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { userguid } = this.props.match.params;
        console.log(userguid);
        this.props.fetchProjects();
    }

    render() {
        return (
            <div>
                <TopNavBar/>
                <Grid divided='vertically' style={{ marginTop: '5em' }} centered>
                    <Grid.Row columns={2}>
                        <Grid.Column width={2}>
                            <Image style={{'border-radius':8}} src={SteveImage} size='small' />
                        </Grid.Column>
                        <Grid.Column centered >
                            <Header as='h1'>Project Title</Header>
                            <p>This is a basic fixed menu template using fixed size containers.</p>
                            <p>
                                A text container is used for the main container, which is useful for single column layouts.
                            </p>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Grid divided='vertically' style={{ marginTop: '5em' }} centered>
                    <Grid.Row columns={3} divided >
                        <Grid.Column centered >
                            <List animated divided verticalAlign='middle'>

                            </List>
                        </Grid.Column>
                        <Grid.Column centered >
                            <Header as='h1'>Project Title</Header>
                            <p>This is a basic fixed menu template using fixed size containers.</p>
                            <p>
                                A text container is used for the main container, which is useful for single column layouts.
                            </p>
                        </Grid.Column>

                        <Grid.Column>
                            <Header as='h1'>Project Title</Header>
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
        fetchProjects: () => dispatch(fetchProjects())
    };
}

const mapStateToProps = state => {
    return { projects: state.projects };
};

const ProfilePage = connect(mapStateToProps, mapDispatchToProps) (UserProfile);
export default ProfilePage;