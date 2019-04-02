import React, { Component } from 'react';
import './Home.css';
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'

class Home extends Component {
    constructor(props) {
      super(props);
    }

    render() {

      return (
          <div className='login-form'>
              <TopNavBar/>
              {/*
      Heads up! The styles below are necessary for the correct render of this example.
      You can do same with CSS, the main idea is that all the elements up to the `Grid`
      below must have a height of 100%.
    */}
              <style>{`
      body > div,
      body > div > div,
      body > div > div > div.login-form {
        height: 85%;
      }
    `}
              </style>
              <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                  <Grid.Column width={10} style={{ maxWidth: 450 }}>
                      <Header as='h2' color='black' textAlign='center'>
                          Login to Motive.
                      </Header>
                      <Form size='large'>
                          <Segment stacked>
                              <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address' />
                              <Form.Input
                                  fluid
                                  icon='lock'
                                  iconPosition='left'
                                  placeholder='Password'
                                  type='password'
                              />

                              <Button color='teal' fluid size='large'>
                                  Login
                              </Button>
                          </Segment>
                      </Form>
                  </Grid.Column>
                  <Grid.Column width={10} style={{ maxWidth: 450 }}>
                      <Header as='h2' color='black' textAlign='center'>
                          Sign Up
                      </Header>
                      <Form size='large'>
                          <Segment stacked>
                              <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address' />
                              <Form.Input
                                  fluid
                                  icon='lock'
                                  iconPosition='left'
                                  placeholder='Password'
                                  type='password'
                              />

                              <Button color='teal' fluid size='large'>
                                  Login
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
  export default Home;