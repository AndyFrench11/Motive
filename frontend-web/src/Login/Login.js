import React, {Component} from 'react';
import {Button, Form, Grid, Header, Container, Segment, Icon, Message} from 'semantic-ui-react'
import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'
import {connect} from "react-redux";
import WelcomeBanner from "../Common/WelcomeBanner";
import {postLogin} from "./actions";
import {login} from "../Common/Auth/actions";

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loginEmail: '',
            loginPassword: ''
        };
    }

    handleChange = (e, {name, value}) => {
        this.setState({
            [name]:value
        })
    };

    handleLoginSubmit = () => {
        const loginDetails = {
            email: this.state.loginEmail,
            password: this.state.loginPassword
        };

        this.props.login(loginDetails);

        this.setState({
            loginEmail: '',
            loginPassword: ''
        })
    };

    handleSignUpSelected = () => {
        this.props.history.push('/signup')
    };

    getCompleteMessage = (statusCode) => {
        switch (statusCode) {
            case 200: return "Logging you in...";
            case 401: return "Invalid email/password combination.";
            case 500: return "The server is down, please try again.";
            default: return "This shouldn't appear...";
        }
    };

    componentWillReceiveProps (nextProps) {
        if (nextProps.loginAttemptCompleted && !nextProps.loginError) {
            this.props.history.push('/home')
        }
    }

    render() {
        const { loginEmail, loginPassword} = this.state;

        let responseMessage;
        if (this.props.loginAttemptCompleted) {
            responseMessage = this.getCompleteMessage(this.props.statusCode)
        }

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
                                <Form id="loginForm"
                                      loading={this.props.isLoggingIn}
                                      error={this.props.loginAttemptCompleted && this.props.loginError}
                                      success={this.props.loginAttemptCompleted && !this.props.loginError}
                                      size='large' onSubmit={this.handleLoginSubmit}>
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
                                        <Message
                                            error
                                            header="Oops!"
                                            content={responseMessage}
                                        />
                                        <Message
                                            success
                                            header='Welcome!'
                                            content={responseMessage}
                                        />
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

function mapDispatchToProps(dispatch) {
    return {
        login: (valuesJson) => dispatch(login(valuesJson))
    };
}

const mapStateToProps = state => {
    return {
        isLoggingIn: state.authReducer.authController.isAuthenticating,
        statusCode: state.authReducer.authController.statusCode,
        loginAttemptCompleted: state.authReducer.authController.complete,
        loginError: state.authReducer.authController.error,
    };
};

export default connect(mapStateToProps, mapDispatchToProps) (Login);