import React, { Component } from 'react';
import './Home.css';
import { Button, Header, Image, Modal } from 'semantic-ui-react'

class Home extends Component {
    constructor(props) {
      super(props);

      this.toggle = this.toggle.bind(this);
      this.state = {
        isOpen: false
      };
    }

    toggle() {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }

    render() {

      const ModalModalExample = () => (
        <Modal trigger={<Button>Show Modal</Button>}>
          <Modal.Header>Select a Photo</Modal.Header>
          <Modal.Content image>
            <Image wrapped size='medium' src='/images/avatar/large/rachel.png' />
            <Modal.Description>
              <Header>Default Profile Image</Header>
              <p>We've found the following gravatar image associated with your e-mail address.</p>
              <p>Is it okay to use this photo?</p>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      )



      return (
        <div>
          <span className="title-header"> Welcome to Motive.</span>
            {ModalModalExample()}
          </div>
          

      );




    };
  }
  
  export default Home;