import React, { Component } from 'react'
import { Button, Header, Image, Modal } from 'semantic-ui-react'

class CreateProjectModal extends Component {
  state = { open: false }

  show() {
    this.setState({ open: true })
  }
  
  close = () => this.setState({ open: false })

  render() {
    const { open } = this.state

    return (
        <Modal dimmer={'blurring'} open={open} onClose={this.close} closeIcon>
          <Modal.Header>Select a Photo</Modal.Header>
          <Modal.Content image>
            <Image wrapped size='medium' src='/images/avatar/large/rachel.png' />
            <Modal.Description>
              <Header>Default Profile Image</Header>
              <p>We've found the following gravatar image associated with your e-mail address.</p>
              <p>Is it okay to use this photo?</p>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={this.close}>
              Nope
            </Button>
            <Button
              positive
              icon='checkmark'
              labelPosition='right'
              content="Yep, that's me"
              onClick={this.close}
            />
          </Modal.Actions>
        </Modal>
    )
  }
}

export default CreateProjectModal
