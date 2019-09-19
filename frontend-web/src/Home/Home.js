import React, {Component} from 'react';
import { 
    Grid, Segment, Header, Divider
} from 'semantic-ui-react';
import TopNavBar from '../Common/TopNavBar';
import Footer from '../Common/Footer';
import _ from 'lodash';
import LoaderInlineCentered from "../Common/Loader";
import axios from 'axios';
import { Route } from 'react-router-dom';
import {connect} from "react-redux";
import { fetchProjectUpdatesForUser } from "./actions";
import ProjectUpdate from "../Project/ProjectPage/ProjectUpdates/ProjectUpdate/ProjectUpdate";

class Home extends Component {
    constructor(props) {
      super(props);

      this.state = {
        users: [],
        modalVisible: false
      };

    }

    componentDidMount() {
        this.props.fetchProjectUpdatesForUser(this.props.currentUser.guid);
    }

    renderHomeFeed() {
        const { projectUpdates } = this.props;
        if (projectUpdates === null || projectUpdates === undefined) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            )
        } else if(projectUpdates.length == 0) {
            return (
                <Segment placeholder style={{marginRight: '5em', marginLeft: '5em'}}>
                    <Header icon>
                        No updates have been made for this project.
                    </Header>
                </Segment>
            )
        } 
        else {
            return (
                <Segment style={{ marginLeft: '5em', marginRight: '5em'}}>
                    {projectUpdates.map((update, index) => (
                        <ProjectUpdate
                            tags={update.relatedProject.tagList}
                            projectName={update.relatedProject.name}
                            update={update}
                            index={index}
                            removeUpdateCallback={this.removeUpdateCallback}
                        />
                    ))};
                 </Segment>

            );
        }
    }

    render() {

        return (
            <div className='home'>
                <TopNavBar/>
                    <Header centered size='large' style={{ marginLeft:'6em', marginTop: '3em'}}>Welcome to the Home Feed! Here, you see updates from all of the projects you are contributing to. 🦍🦍🦍</Header>
                    {this.renderHomeFeed()}
                <Footer/>
            </div>
        );
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchProjectUpdatesForUser: (userGuid) => dispatch(fetchProjectUpdatesForUser(userGuid))
    };
}

const mapStateToProps = state => {
    const { homeReducer } = state;
    const { homeController } = homeReducer;
    const { isUpdating, lastUpdated, result } = homeController;
    return {
        isUpdating: isUpdating,
        projectUpdates: result,
        lastUpdated: lastUpdated,
        currentUser: state.authReducer.authController.currentUser
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Home);

//    userlist() {
//     console.log(this.state.users)
//     return this.state.users.map((item, key) =>

//       
//     )
// }