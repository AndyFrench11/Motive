import React, {Component} from 'react';
import {Button, Form, Grid, Header, Container, Segment, Icon} from 'semantic-ui-react'
import {DateInput} from '@opuscapita/react-dates'
import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'
import {postLogin, postSignUp} from "./actions";
import {connect} from "react-redux";
import WelcomeBanner from "../Common/WelcomeBanner";

class Login extends Component {
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

        this.setState({
            loginEmail: '',
            loginPassword: ''
        })
    };

    handleSignUpSelected = () => {
        this.props.history.push('/signup')
    };

    render() {
        const { loginEmail, loginPassword, signUpName, signUpEmail, signUpPassword} = this.state;

        return (
            <div className='home'>
                <TopNavBar/>
                <WelcomeBanner/>
                <br/>
                <br/>
                <br/>
                <Container>
                    <Grid textAlign='center'>
                        <Grid.Column width={10} style={{maxWidth: 450}}>
                            <Grid.Row>
                                <Header as='h2' color='black' textAlign='center'>
                                    Login
                                </Header>
                                <Form id="loginForm" size='large' onSubmit={this.handleLoginSubmit}>
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
                                        <button className="ui large primary button">Login</button>
                                    </Segment>
                                </Form>
                                <br/>
                                <button className="ui secondary button" onClick={this.handleSignUpSelected}>Sign Up</button>
                                <br/>
                                <br/>
                                <br/>
                                <br/>
                                <Button color='facebook'>
                                    <Icon name='facebook' /> Facebook
                                </Button>
                                <Button color='google plus'>
                                    <Icon name='google plus' /> Google Plus
                                </Button>
                            </Grid.Row>
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
        isSigningIn: isPosting,
        result: result,
        lastUpdated: lastUpdated,
    };
};

export default connect(mapStateToProps) (Login);