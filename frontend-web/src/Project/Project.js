import React from 'react'
import {
    Container,
    Divider,
    Dropdown,
    Grid,
    Header,
    Image,
    List,
    Menu,
    Segment,
    Button, Modal,
} from 'semantic-ui-react'

import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'

import SteveImage from '../Images/steve.jpg'

class ProjectPageLayout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false
        };
    }

    showModal = () => {
        this.setState({
            modalVisible: true
        });
    };

    closeModal = () => {
        this.setState({
            modalVisible: false
        });
    };


    render() {
    return (
      <div>
        <TopNavBar/>

          <Modal dimmer={'blurring'} open={this.state.modalVisible} onClose={this.closeModal} closeIcon>
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

        <Button style={{ marginTop: '5em' }} onClick={this.showModal}>Create Project</Button>

        <Grid divided='vertically' style={{ marginTop: '5em' }} centered>
        <Grid.Row columns={2}>
        <Grid.Column width={2}>
            <Image style={{'border-radius':8}} src={SteveImage} size='small' />
        </Grid.Column>
        <Grid.Column centered>
        <Header as='h1'>Project Title</Header>
            <p>Description</p>
            A text container is used for the main container, which is useful for single column layouts.
        </Grid.Column>
        </Grid.Row>

        {/* <Grid.Row columns={3}>
        <Grid.Column>
            <Image src='/images/wireframe/paragraph.png' />
        </Grid.Column>
        <Grid.Column>
            <Image src='/images/wireframe/paragraph.png' />
        </Grid.Column>
        <Grid.Column>
            <Image src='/images/wireframe/paragraph.png' />
        </Grid.Column>
        </Grid.Row> */}
        </Grid>

    {/*<Container text >*/}

    {/*</Container>*/}
      <Footer/>
    </div>
    );
  }
}

export default ProjectPageLayout