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
import history from "./history"
import "react-datepicker/dist/react-datepicker.css";
import Home from './Home/Home';

const store = configureStore();

function Index() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

function AppRouter() {
  return (
        <Router history={history}>
          <div>
            <Route exact path="/" component={Home} />
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
