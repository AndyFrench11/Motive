import React from 'react';
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import './index.css';
import Project from './Project/Project';
import 'semantic-ui-css/semantic.min.css';
import 'semantic-ui/dist/semantic.min.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import UserProfile from "./UserProfile/UserProfile";
import { Provider } from "react-redux";
import configureStore from "./configureStore";
import { connect } from "react-redux";
import Landing from "./Landing/Landing";
import Home from "./Home/Home";

const store = configureStore()


function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}

function AppRouter() {
  return (
        <Router>
          <div>
            <Route exact path="/" component={Landing} />
            <Route exact path ="/home" component={Home}/>
            <Route path="/about" component={About} />
            <Route path="/users" component={Users} />
            <Route path="/test" component={Users} />
            <Route path="/profile" component={UserProfile} />
            <Route path="/project" component={Project} />
          </div>
        </Router>
  );
}

export default AppRouter;

ReactDOM.render(<Provider store={store}>
                  <AppRouter />
                </Provider>,
                    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
