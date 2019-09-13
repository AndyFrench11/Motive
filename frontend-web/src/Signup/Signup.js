import React, {Component} from 'react';
import {Button, Form, Grid, Header, Container, Segment, Icon, List, Menu, Dropdown, Message} from 'semantic-ui-react'
import {DateInput} from '@opuscapita/react-dates'
import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'
import {postSignUp, resetSignUpState} from "./actions";
import {connect} from "react-redux";
import WelcomeBanner from "../Common/WelcomeBanner";
import validate from "../Common/FormValidation";
import DateOfBirthPicker from "./dateOfBirthPicker";

const Filter = require('bad-words');


const ValidationStatus = Object.freeze({
    "INVALID_PASSWORD" : 1,
    "PASSWORD_MISMATCH" : 2,
    "INVALID_NAME" : 3,
    "PROFANE_NAME" : 4,
    "VALID": 0 }
);


class SignUp extends Component {
    constructor(props) {
        super(props);

        this.props.resetSignUp();

        this.state = {
            firstNameInput: '',
            lastNameInput: '',
            emailInput: '',
            passwordInput: '',
            confirmPasswordInput: '',
            dateOfBirthInput: '',
            validationStatus: ValidationStatus.VALID
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
            confirmPassword: this.state.confirmPasswordInput,
            birthday: this.state.dateOfBirthInput
        };

        console.log(this.state.validationStatus);

        // Check for profane names
        let profanityFilter = new Filter();
        if (profanityFilter.isProfane(signUpDetails.firstName.toLowerCase()) ||
            profanityFilter.isProfane(signUpDetails.lastName.toLowerCase())) {
            this.setState({validationStatus: ValidationStatus.PROFANE_NAME});
            return;
        }

        if (signUpDetails.password !== signUpDetails.confirmPassword) {
            this.setState({validationStatus: ValidationStatus.PASSWORD_MISMATCH});
            return;
        }

        if (signUpDetails.password.length < 8) {
            this.setState({validationStatus: ValidationStatus.INVALID_PASSWORD});
            return;
        }

        this.setState({validationStatus: ValidationStatus.VALID});
        this.props.postSignUp(signUpDetails);

        this.state = {
            firstNameInput: '',
            lastNameInput: '',
            emailInput: '',
            passwordInput: '',
            confirmPasswordInput: '',
            dateOfBirthInput: '',
            validationStatus: ValidationStatus.VALID
        };
    };

    getCompleteMessage = (statusCode) => {
        switch (statusCode) {
            case 201: return "You're all signed up!";
            case 409: return "Your account already exists.";
            case 500: return "The server is down, please try again.";
            default: return "";
        }
    };

    // "INVALID_PASSWORD" : 1,
    // "PASSWORD_MISMATCH" : 2,
    // "INVALID_NAME" : 3,
    // "PROFANE_NAME" : 4,
    // "VALID": 0 }

    getValidationFailedMessage = (validationStatus) => {
        switch (validationStatus) {
            case ValidationStatus.INVALID_PASSWORD: return "Password does not meet requirements.";
            case ValidationStatus.PASSWORD_MISMATCH: return "Passwords do not match, please re-enter.";
            case ValidationStatus.INVALID_NAME: return "Name(s) are invalid.";
            case ValidationStatus.PROFANE_NAME: return "Name(s) are offensive, please change.";
            default: return "";
        }
    };

    render() {
        const {firstName, lastName, email, password, confirmPassword} = this.state;

        let responseMessage;
        if (this.props.signUpAttemptCompleted) {
            responseMessage = this.getCompleteMessage(this.props.result.status)
        } else if (this.state.validationStatus !== ValidationStatus.VALID) {
            responseMessage = this.getValidationFailedMessage(this.state.validationStatus)
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
                                warning={this.state.validationStatus !== ValidationStatus.VALID}
                                success={this.props.signUpAttemptCompleted && !this.props.signInError}
                                  size='large' onSubmit={this.handleSignUpSubmit}>
                                <Segment>
                                    {/*Name Input*/}
                                    <Form.Group widths='equal'>
                                        <Form.Input
                                            placeholder='First Name'
                                            // required
                                            name='firstNameInput'
                                            value={firstName}
                                            onChange={this.handleChange}
                                        />
                                        <Form.Input
                                            placeholder='Last Name'
                                            // required
                                            name='lastNameInput'
                                            value={lastName}
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
                                        value={email}
                                        onChange={this.handleChange}
                                    />
                                    <br/><br/>
                                    {/*Password Input */}
                                    <Form.Input
                                        placeholder='Password'
                                        required
                                        type="password"
                                        name='passwordInput'
                                        value={password}
                                        onChange={this.handleChange}
                                        // validation={}
                                    />
                                    <Form.Input
                                        placeholder='Confirm Password'
                                        required
                                        type="password"
                                        name='confirmPasswordInput'
                                        value={confirmPassword}
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
                                    warning
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
        resetSignUp: () => dispatch(resetSignUpState())
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
