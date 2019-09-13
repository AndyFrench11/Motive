import React from 'react';
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import './index.css';
import Project from './Project/Project';
import 'semantic-ui-css/semantic.min.css';
import 'semantic-ui/dist/semantic.min.css';
import { Router, Route, Link } from "react-router-dom";
import UserProfile from "./UserProfile/UserProfile";
import { Provider } from "react-redux";
import configureStore from "./configureStore";
import { connect } from "react-redux";
import Home from "./Home/Home";
import history from "./history"
import "react-datepicker/dist/react-datepicker.css";
import Signup from "./Signup/Signup";
import Login from "./Login/Login";
import {createStore} from "redux";
import rootReducer from "./reducers";
import StateLoader from "./stateLoader";
import Redirect from "react-router-dom/es/Redirect";

const stateLoader = new StateLoader();
const store = configureStore(stateLoader.loadState());

store.subscribe(() => {
    stateLoader.saveState(store.getState());
});


function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

const ProtectedRoute
    = ({ isAllowed, ...props }) =>
    store.getState().authReducer.authController.currentUser
        ? <Route {...props}/>
        : <Redirect to="/login"/>;

function AppRouter() {
    return (
        <Router history={history}>
            <div>
                <Route exact path="/" component={Login} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/signup" component={Signup} />


                <ProtectedRoute exact path="/home" component={Home}/>
                <Route path="/about" component={About} />
                <Route path="/users" component={Users} />
                <Route path="/test" component={Users} />
                <Route exact path="/profile/:userguid" component={UserProfile} />
                <Route exact path="/profile/:userguid/project/:projectguid" component={Project} />
            </div>
        </Router>
    );
}

export default AppRouter;

ReactDOM.render(<Provider store={store}>
                  <AppRouter/>
                </Provider>,
                    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
