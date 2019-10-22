import React from 'react'
import {Button, Form, List, Segment} from 'semantic-ui-react'
import axios from "axios";

const serverUrl = process.env.REACT_APP_BACKEND_ADDRESS;

export default class Sharer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emails: [],
            currentEmail: ""
        };
    }

    sendRequests = () => {
        axios.patch(serverUrl + `/project/${this.props.projectId}/giveAccessTo`, this.state.emails, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        });

        this.setState({
            emails: []
        });
    };

    handleChange = (event, {name, value}) => {
        this.setState({
            [name]:value
        });
    };

    handleNewEmailAdded = () => {
        this.setState(state => {
            const emails = [...state.emails, this.state.currentEmail];
            return {
                emails,
                currentEmail: ""
            };
        });

    };


    render() {
        let { emails, currentEmail } = this.state;
        return (
            <Segment>
                <p> Add User(s) To Project </p>
                <Form onSubmit={this.handleNewEmailAdded}>
                    <Form.Input
                        placeholder='Email'
                        required
                        type="email"
                        name='currentEmail'
                        value={currentEmail}
                        onChange={this.handleChange}
                    />
                    <List bulleted items={emails}/>
                </Form>
                <Button
                    secondary
                    type='submit'
                    fluid
                    size='large'
                    onClick={this.sendRequests}
                >Give Access</Button>
            </Segment>

        )
    }
}