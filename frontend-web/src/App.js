import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';




class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      chosenPerson: null
    }
  }

  fetchRandomPerson() {
    fetch("http://localhost:8080/api/random")
    .then(res => res.json())
    .then(
      (result) => {
        console.log(result)
        this.setState({
          isLoaded: true,
          chosenPerson: result.chosenPerson
        });
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        this.setState({
          isLoaded: true,
          chosenPerson: "Make sure you have the API running!"
        });
      }
    )
  }

  andy() {
    return <h1>Hey its Andy</h1>
  }

  matilda() {
    return <h1>Hey its Matilda</h1>
  }

  buzz() {
    return <h1>Hey its Buzz</h1>
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <button 
            variant="primary"
            onClick={() => {
              this.fetchRandomPerson()
          }}>Guess who I am!</button>

          {this.state.chosenPerson}

          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
