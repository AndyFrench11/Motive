import React from 'react';
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import './index.css';
import Project from './Project/ProjectPage/Project';
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
import rootReducer from "./rootReducer";
import StateLoader from "./stateLoader";
import { Redirect } from "react-router-dom";
import AppRouter from "./app";

const stateLoader = new StateLoader();
const store = configureStore(stateLoader.loadState());

store.subscribe(() => {
    stateLoader.saveState(store.getState());
});

ReactDOM.render(
    <Provider store={store}>
        <AppRouter/>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
