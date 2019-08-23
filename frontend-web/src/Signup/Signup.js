import React, {Component} from 'react';
import {Button, Form, Grid, Header, Container, Segment, Icon, List, Menu, Dropdown, Message} from 'semantic-ui-react'
import {DateInput} from '@opuscapita/react-dates'
import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'
import {postLogin, postSignUp} from "./actions";
import {connect} from "react-redux";
import WelcomeBanner from "../Common/WelcomeBanner";
import validate from "../Common/FormValidation";
import DateOfBirthPicker from "./dateOfBirthPicker";

class SignUp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstNameInput: '',
            lastNameInput: '',
            emailInput: '',
            passwordInput: '',
            confirmPasswordInput: '',
            dateOfBirthInput: ''
        };

        console.log(this.props.signUpAttemptCompleted)
    }

    handleChange = (event, {name, value}) => {
        this.setState({
            [name]:value
        })
    };

    handleDateChange = (momentDate) => {
        this.setState({dateOfBirthInput: momentDate.format("D-M-YYYY")});
    };


    handleSignUpSubmit = () => {
        const signUpDetails = {
            firstName: this.state.firstNameInput,
            lastName: this.state.lastNameInput,
            email: this.state.emailInput,
            password: this.state.passwordInput,
            birthday: this.state.dateOfBirthInput
        };

        // TODO clear inputs

        this.props.postSignUp(signUpDetails);
    };

    getCompleteMessage = (statusCode) => {
        switch (statusCode) {
            case 201: return "You're all signed up!";
            case 409: return "Your account already exists.";
            case 500: return "The server is down, please try again.";
            default: return "This shouldn't appear...";
        }
    };

    render() {

        let responseMessage;
        if (this.props.signUpAttemptCompleted) {
            responseMessage = this.getCompleteMessage(this.props.result.status)
        }

        return (
            <div className='home'>
                <TopNavBar/>
                <WelcomeBanner/>
                <br/> <br/> <br/>
                <Container>
                    <Grid textAlign='center'>
                        <Grid.Column width={10} style={{maxWidth: 450}}>
                            <Header as='h2' color='black' textAlign='center'>
                                Sign Up
                            </Header>
                            <Form
                                loading={this.props.isSigningIn}
                                error={this.props.signUpAttemptCompleted && this.props.signInError}
                                success={this.props.signUpAttemptCompleted && !this.props.signInError}
                                  size='large' onSubmit={this.handleSignUpSubmit}>
                                <Segment>
                                    {/*Name Input*/}
                                    <Form.Group widths='equal'>
                                        <Form.Input
                                            placeholder='First Name'
                                            // required
                                            name='firstNameInput'
                                            onChange={this.handleChange}
                                        />
                                        <Form.Input
                                            placeholder='Last Name'
                                            // required
                                            name='lastNameInput'
                                            onChange={this.handleChange}
                                        />
                                    </Form.Group>

                                    <DateOfBirthPicker callbackFromParent={this.handleDateChange}/>

                                    {/*Email Input*/}
                                    <Form.Input
                                        placeholder='Email'
                                        required
                                        type="email"
                                        name='emailInput'
                                        onChange={this.handleChange}
                                        // validation={}
                                    />
                                    <br/><br/>
                                    {/*Password Input */}
                                    <Form.Input
                                        placeholder='Password'
                                        required
                                        type="password"
                                        name='passwordInput'
                                        onChange={this.handleChange}
                                        // validation={}
                                    />
                                    <Form.Input
                                        placeholder='Confirm Password'
                                        required
                                        type="password"
                                        name='confirmPasswordInput'
                                        onChange={this.handleChange}
                                        // validation={}
                                    />

                                    {/*Password Policy Notice*/}
                                    <List bulleted>
                                        <List.Item>Passwords should be at least 8 characters long.</List.Item>
                                        <List.Item>Passwords shouldn't use your name(s).</List.Item>
                                    </List>

                                    <br/>
                                    <br/>
                                    <Form.Button
                                        color='blue'
                                        type='submit'
                                        fluid
                                        size='large'
                                    >
                                        Sign up
                                </Form.Button>
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
                            <br/>
                            <br/>
                            <br/>
                            <Button color='facebook'>
                                <Icon name='facebook' /> Facebook
                            </Button>
                            <Button color='google plus'>
                                <Icon name='google plus' /> Google Plus
                            </Button>
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
        postSignUp: (valuesJson) => dispatch(postSignUp(valuesJson)),
    };
}

const mapStateToProps = state => {
    return {
        isSigningIn: state.signUpReducer.signUpController.isPosting,
        result: state.signUpReducer.signUpController.result,
        lastUpdated: state.signUpReducer.signUpController.lastUpdated,
        signInError: state.signUpReducer.signUpController.error,
        signUpAttemptCompleted: state.signUpReducer.signUpController.complete
    };
};

const SignUpPage = connect(mapStateToProps, mapDispatchToProps) (SignUp);
export default SignUpPage
