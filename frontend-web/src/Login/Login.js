import React, {Component} from 'react';
import {Button, Form, Grid, Header, Container, Segment, Icon, Message} from 'semantic-ui-react'
import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'
import {connect} from "react-redux";
import WelcomeBanner from "../Common/WelcomeBanner";
import {login, resetAuthState} from "../Common/Auth/actions";
import {Redirect, withRouter} from "react-router-dom";

class Login extends Component {
    constructor(props) {
        super(props);

        this.props.resetAuthState();

        this.state = {
            loginEmail: '',
            loginPassword: '',
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

        this.props.login(loginDetails).then(() => {
            if (this.props.loggedInUser) {
                this.props.history.replace('/home')
            }}
        );

        this.setState({
            loginEmail: '',
            loginPassword: ''
        })
    };

    handleSignUpSelected = () => {
        this.props.history.push("/signup");
    };

    getCompleteMessage = (statusCode) => {
        switch (statusCode) {
            case 401: return "Invalid email/password combination.";
            case 500: return "The server is down, please try again.";
            default: return "";
        }
    };

    render() {
        // Attach state to form, so we can clear it
        const { loginEmail, loginPassword } = this.state;

        let responseMessage;
        if (this.props.loginError) {
            responseMessage = this.getCompleteMessage(this.props.loginError.statusCode)
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
                                      error={this.props.loginError}
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
        login: (valuesJson) => dispatch(login(valuesJson)),
        resetAuthState: () => dispatch(resetAuthState())
    };
}

const mapStateToProps = state => {
    return {
        isLoggingIn: state.authReducer.authController.isLoggingIn,
        loginError: state.authReducer.authController.loginError,
        loggedInUser: state.authReducer.authController.currentUser,
    };
};

const LoginPage = connect(mapStateToProps, mapDispatchToProps) (Login);
export default withRouter(LoginPage)