import React, {Component} from 'react';
import './Landing.css';
import {Button, Form, Grid, Header, Container, Segment, Icon} from 'semantic-ui-react'
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
                                        <button className="ui primary button">Login</button>
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
            isPosting: isPosting,
            result: result,
            lastUpdated: lastUpdated,
        };
};

export default connect(mapStateToProps) (Landing);