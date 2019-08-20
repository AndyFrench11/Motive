import React, {Component} from 'react';
import {Button, Form, Grid, Header, Container, Segment, Icon, List, Menu, Dropdown} from 'semantic-ui-react'
import {DateInput} from '@opuscapita/react-dates'
import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'
import {postLogin, postSignUp} from "./actions";
import {connect} from "react-redux";
import WelcomeBanner from "../Common/WelcomeBanner";
import validate from "../Common/FormValidation";
import TextInput from "../Common/Forms/TextInput";
import DateOfBirthPicker from "./dateOfBirthPicker";

class Signup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstNameInput: '',
            lastNameInput: '',
            usernameInput: '',
            passwordInput: '',
            confirmPasswordInput: '',
        };
    }

    handleChange = (event, {name, value}) => {
        this.setState({
            [name]:value
        })
    };

    handleDateChange = (momentDate) => {
        console.log(`Is DOB valid: ${momentDate.isValid()}`);
        this.setState({dateOfBirth: momentDate});
    };


    handleSignUpSubmit = () => {
        console.log("sign up");
        console.log(this.state);
        // const signUpDetails = {
        //     name: this.state.signUpName,
        //     email: this.state.signUpEmail,
        //     password: this.state.signUpPassword,
        //     birthday: this.state.signUpBirthday
        // };
        // const {dispatch} = this.props;
        // dispatch(postSignUp(signUpDetails));
        //
        // this.setState({
        //     signUpName: '',
        //     signUpEmail: '',
        //     signUpPassword: '',
        //     signUpBirthday: new Date()
        // })
    };

    render() {
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
                            <Form size='large' onSubmit={this.handleSignUpSubmit}>
                                <Segment>
                                    {/*Name Input*/}
                                    <Form.Group widths='equal'>
                                        <Form.Input
                                            placeholder='First Name'
                                            required
                                            name='firstNameInput'
                                            onChange={this.handleChange}
                                        />
                                        <Form.Input
                                            placeholder='Last Name'
                                            required
                                            name='lastNameInput'
                                            onChange={this.handleChange}
                                        />
                                    </Form.Group>

                                    <DateOfBirthPicker callbackFromParent={this.handleDateChange}/>

                                    {/*Username Input*/}
                                    <Form.Input
                                        placeholder='Username'
                                        required
                                        name='usernameInput'
                                        onChange={this.handleChange}
                                        // validation={}
                                    />

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

export default connect(mapStateToProps) (Signup);
