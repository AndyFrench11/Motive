import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, Label, Menu, Input, Button, Modal
} from 'semantic-ui-react'
import {connect} from "react-redux";
import uuidv4 from 'uuid/v4';

class UpdateProjectImageModal extends React.Component {
    state = { 

    };

    render() {

        return (
            <Modal open='true'>
            <Modal.Header>Select a Photo</Modal.Header>
            <Modal.Content image>
              <Image wrapped size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' />
              <Modal.Description>
                <Header>Default Profile Image</Header>
                <p>
                  We've found the following gravatar image associated with your e-mail
                  address.
                </p>
                <p>Is it okay to use this photo?</p>
              </Modal.Description>
            </Modal.Content>
          </Modal>
        );
  }
}

const mapStateToProps = state => {
    return {};
};

export default connect(mapStateToProps)(UpdateProjectImageModal);
