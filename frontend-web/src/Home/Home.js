import React, { Component } from 'react';
import './Home.css';
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import axios from 'axios';
import { Route } from 'react-router-dom';

//const serverUrl = process.env.REACT_APP_BACKEND_ADDRESS;
const serverUrl = "http://csse-s402g2.canterbury.ac.nz:8080/api";

class Home extends Component {
    constructor(props) {
      super(props);

      this.state = {
        users: []
      };
    }

    componentDidMount() {
      axios.get(serverUrl + "/person/allpeople")
            .then(response => 
              this.setState({
                users: response.data
              }
            ))
            .catch(error => {
                console.log("The server is not running!");
                console.log(error)
            })
    }

    redirectToUserPage(userguid) {
      this.props.history.push()
    }

    userlist() {
      return this.state.users.map((item, key) =>

          <Route render={({ history }) => (
            <button
              type='button'
              onClick={() => { history.push(`/profile/${item.guid}/`) }}
            >
              {item.firstName} {item.lastName}
            </button>
          )} />
        )
    }

    render() {

      return (
        <div>
          <h2>Home</h2>
          <h3>All Users:</h3>
          {this.userlist()}
        </div>

      );
    };
  }
  
  export default Home;