import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './Test/App';
import * as serviceWorker from './serviceWorker';
import Home from './Home/Home';
import Project from './Project/Project';
import 'semantic-ui-css/semantic.min.css';
import 'semantic-ui/dist/semantic.min.css';
// import { Provider } from 'react-redux'
// import todoApp from './reducers'
// import App from './Todo/components/App'
// import { createStore } from 'redux'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import UserProfile from "./UserProfile/UserProfile";


// const store = createStore(todoApp)


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
    <Router>
      <div>
        <Route exact path="/" component={Project} />
        <Route path="/about" component={About} />
        <Route path="/users" component={Users} />
        <Route path="/test" component={Users} />
        <Route path="/profile" component={UserProfile} />
      </div>
    </Router>
  );
}

export default AppRouter;

ReactDOM.render(
                  <AppRouter />
                  , 
                    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

//<Link to="/">Home</Link>