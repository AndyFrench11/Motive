import React, { Component } from 'react';
import './Landing.css';
import { Button, Form, Grid, Header, Container, Image, Message, Segment } from 'semantic-ui-react'
import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'

class Landing extends Component {
    constructor(props) {
      super(props);
    }

    render() {

      return (
          <div className='home'>
              <TopNavBar/>
              <div id="motive-title" class="ui inverted vertical center aligned segment">
                  <Container text>
                      <Header
                          as='h1'
                          content='Welcome to Motive.'
                          inverted
                          style={{
                              fontSize: '4em',
                              fontWeight: 'normal',
                              marginBottom: 0,
                              marginTop: '2.5em',
                          }}
                      />
                      <Header
                          as='h2'
                          content='What is your Motive?'
                          inverted
                          style={{
                              fontSize: '1.7em',
                              fontWeight: 'normal',
                              marginTop: '1em',
                              marginBottom: '2em',
                          }}
                      />
                  </Container>
              </div>
              <Grid textAlign='center' verticalAlign='middle'>
                  <Grid.Column width={10} style={{ maxWidth: 450 }}>
                      <Grid.Row>
                          <Header as='h2' color='black' textAlign='center'>
                              Login
                          </Header>
                          <Form size='large'>
                              <Segment>
                                  <Form.Input fluid icon='envelope outline' iconPosition='left' placeholder='E-mail' />
                                  <Form.Input
                                      fluid
                                      icon='lock'
                                      iconPosition='left'
                                      placeholder='Password'
                                      type='password'
                                  />

                                  <Button color='teal' fluid size='large'>
                                      Login!
                                  </Button>
                              </Segment>
                          </Form>
                      </Grid.Row>
                      <Grid.Row>
                          <Button
                              basic
                              color='blue'
                              content='Facebook'
                              icon='thumbs up'
                          />
                          <Button
                              basic
                              color='red'
                              content='Google'
                              icon='envelope'
                          />
                      </Grid.Row>
                  </Grid.Column>
                  <Grid.Column width={10} style={{ maxWidth: 450 }}>
                      <Header as='h2' color='black' textAlign='center'>
                          Sign Up
                      </Header>
                      <Form size='large'>
                          <Segment>
                              <Form.Input fluid icon='user' iconPosition='left' placeholder='Name' />
                              <Form.Input fluid icon='envelope outline' iconPosition='left' placeholder='E-mail' />
                              <Form.Input
                                  fluid
                                  icon='lock'
                                  iconPosition='left'
                                  placeholder='Password'
                                  type='password'
                              />

                              <Button color='teal' fluid size='large'>
                                  Sign up!
                              </Button>
                          </Segment>
                      </Form>
                  </Grid.Column>
              </Grid>
              <Footer/>
          </div>
      );
    };
  }
  export default Landing;