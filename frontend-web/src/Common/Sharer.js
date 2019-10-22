import React from 'react'
import {Form, List} from 'semantic-ui-react'

export default class Sharer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emails: [
                "test@test.com",
            ],
            currentEmail: ""
        };
    }

    checkState = () => {
        console.log(this.state);
    };

    handleChange = (event, {name, value}) => {
        this.setState({
            [name]:value
        });
    };

    handleNewEmailAdded = () => {
        console.log("BING");

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
            <div>
                <p> Add User To Project </p>
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
            </div>

        )
    }
}