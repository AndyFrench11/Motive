import React, {Component} from 'react';
import './Landing.css';
import {Button, Form, Grid, Header, Container, Segment} from 'semantic-ui-react'
import {DateInput} from '@opuscapita/react-dates'
import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'
import {postLogin, postSignUp} from "./actions";
import {connect} from "react-redux";

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginEmail: '',
            loginPassword: '',
            signUpName: '',
            signUpEmail: '',
            signUpPassword: '',
            signUpBirthday: new Date()
        };
    }

    handleChange = (e, {name, value}) => {
        this.setState({
            [name]:value
        })
    };

    handleDateChange = (date) => {
        this.setState({
            signUpBirthday: date
        });
    };

    handleLoginSubmit = () => {
        console.log("login");
        console.log(this.state);
        const loginDetails = {
            email: this.state.loginEmail,
            password: this.state.loginPassword
        };
        const {dispatch} = this.props;
        dispatch(postLogin(loginDetails));
    };

    handleSignUpSubmit = () => {
        console.log("sign up");
        console.log(this.state);
        const signUpDetails = {
            name: this.state.signUpName,
            email: this.state.signUpEmail,
            password: this.state.signUpPassword,
            birthday: this.state.signUpBirthday
        };
        const {dispatch} = this.props;
        dispatch(postSignUp(signUpDetails));
    };

    render() {
        const { loginEmail, loginPassword, signUpName, signUpEmail, signUpPassword} = this.state;

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
                <br/>
                <br/>
                <br/>
                <Container>
                    <Grid textAlign='center' verticalAlign='middle'>
                        <Grid.Column width={10} style={{maxWidth: 450}}>
                            <Grid.Row>
                                <Header as='h2' color='black' textAlign='center'>
                                    Login
                                </Header>
                                <Form size='large' onSubmit={this.handleLoginSubmit}>
                                    <Segment>
                                        <Form.Input
                                            fluid icon='envelope outline'
                                            iconPosition='left'
                                            placeholder='E-mail'
                                            required
                                            name='loginEmail'
                                            value={loginEmail}
                                            onChange={this.handleChange}
                                        />
                                        <Form.Input
                                            fluid
                                            icon='lock'
                                            iconPosition='left'
                                            placeholder='Password'
                                            type='password'
                                            required
                                            name='loginPassword'
                                            value={loginPassword}
                                            onChange={this.handleChange}
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
                        <Grid.Column width={10} style={{maxWidth: 450}}>
                            <Header as='h2' color='black' textAlign='center'>
                                Sign Up
                            </Header>
                            <Form size='large' onSubmit={this.handleSignUpSubmit}>
                                <Segment>
                                    <Form.Input
                                        fluid icon='user'
                                        iconPosition='left'
                                        placeholder='Name'
                                        required
                                        name='signUpName'
                                        value={signUpName}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Input
                                        fluid icon='envelope outline'
                                        iconPosition='left'
                                        placeholder='E-mail'
                                        required
                                        name='signUpEmail'
                                        value={signUpEmail}
                                        onChange={this.handleChange}
                                    />
                                    <Form.Input
                                        fluid
                                        icon='lock'
                                        iconPosition='left'
                                        placeholder='Password'
                                        type='password'
                                        required
                                        name='signUpPassword'
                                        value={signUpPassword}
                                        onChange={this.handleChange}
                                    />
                                    <span>Birthday</span>
                                    <DateInput
                                        value={this.state.signUpBirthday}
                                        dateFormat="dd/MM/yyyy"
                                        disabled={false}
                                        locale="en"
                                        onChange={this.handleDateChange}
                                        showToTop={true}
                                    />
                                    <Button color='teal' fluid size='large'>
                                        Sign up!
                                    </Button>
                                </Segment>
                            </Form>
                        </Grid.Column>
                    </Grid>
                </Container>
                <Footer/>
            </div>
        );
    };
}

const mapStateToProps = state => {
    const { landingReducers } = state;
    const { loginController } = landingReducers;
    const { isPosting, lastUpdated, result } = loginController;
    return {
            isPosting: isPosting,
            result: result,
            lastUpdated: lastUpdated,
        };
};

export default connect(mapStateToProps) (Landing);