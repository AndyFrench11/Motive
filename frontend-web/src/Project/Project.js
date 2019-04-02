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
    Button,
    Modal,
    Input,
    TransitionablePortal,
    Form,
    Checkbox
} from 'semantic-ui-react'

import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'

import SteveImage from '../Images/steve.jpg'
import BookImage from '../Images/Hobbies Icons/010-book.png'

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

          <TransitionablePortal open={this.state.modalVisible}  transition={{ animation:'fade up', duration: 500 }}>
          <Modal open={true} onClose={this.closeModal} closeIcon>
              <Modal.Header>Create a New Project</Modal.Header>
              <Modal.Content >

                  <Form>
                      <Form.Field>
                          <label>First Name</label>
                          <input placeholder='First Name' />
                      </Form.Field>
                      <Form.Field>
                          <label>Last Name</label>
                          <input placeholder='Last Name' />
                      </Form.Field>
                      <Form.Field>
                          <Checkbox label='I agree to the Terms and Conditions' />
                      </Form.Field>
                      <Button type='submit'>Submit</Button>
                  </Form>

                  <Input label='Name' placeholder='My Awesome New Project!' />
                  <br/>
                  <Input label='Description' placeholder='My Awesome New Project!' />
                  <br/>

                  <Input
                      icon='tags'
                      iconPosition='left'
                      label={{ tag: true, content: 'Add Tag' }}
                      labelPosition='right'
                      placeholder='Enter tags'

                  />

                  <Image wrapped size='small' src={BookImage} />

              </Modal.Content>
              <Modal.Actions>
                  <Button color='black' onClick={this.close}>
                      Nope
                  </Button>
                  <Button
                      positive
                      icon='checkmark'
                      labelPosition='right'
                      content="All good to go!"
                      onClick={this.close}
                  />
              </Modal.Actions>
          </Modal>
          </TransitionablePortal>

        <Button style={{ marginTop: '5em' }} onClick={this.showModal}>Create Project</Button>

        <Grid divided='vertically' style={{ marginTop: '5em' }} centered>
        <Grid.Row columns={2}>
        <Grid.Column width={2}>
            <Image style={{'border-radius':8}} src={BookImage} size='small' />
        </Grid.Column>
        <Grid.Column centered>
        <Header as='h1'>Project Title</Header>
            <p>Description</p>

        </Grid.Column>
        </Grid.Row>

        <Divider/>

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