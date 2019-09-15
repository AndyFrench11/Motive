import React, {Component} from 'react';
import history from "./history";
import Login from "./Login/Login";
import Signup from "./Signup/Signup";
import Home from "./Home/Home";
import UserProfile from "./UserProfile/UserProfile";
import Project from "./Project/Project";
import {Redirect, Route, Router, Switch} from "react-router-dom";
import {connect} from "react-redux";

const ProtectedRoute
    = ({ isAllowed, ...props }) =>
    isAllowed
        ? (<Route {...props}/>)
        : (<Redirect to="/login"/>);

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const isLoggedIn = this.props.isAuthenticated;
        return (
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/signup" component={Signup} />


                    <ProtectedRoute exact path="/home" component={Home} isAllowed={isLoggedIn}/>
                    <Route exact path="/profile/:userguid" component={UserProfile} />
                    <Route exact path="/profile/:userguid/project/:projectguid" component={Project} />
                </Switch>
            </Router>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.authReducer.authController.currentUser,
    };
};

const AppRouter = connect(mapStateToProps) (App);
export default AppRouter
