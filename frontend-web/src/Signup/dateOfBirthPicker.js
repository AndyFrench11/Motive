import React from 'react'
import {Dropdown, Form, Message, Segment} from 'semantic-ui-react'
import * as moment from "moment";


export default class DateOfBirthPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            monthInput: '',
            dayInput: '',
            yearInput: '',
            isDateValid: false
        };

        this.monthOptions = [];

        moment.months().forEach(month => {
            this.monthOptions.push({
                key: month,
                text: month,
                value: month,
            })
        });
    }

    checkState = () => {
        console.log(this.state);
    };

    completeChange = () => {
        // Parse date input string (remove leading zeros from day) to a Moment object
        let dateStr = `${this.state.monthInput}-${parseInt(this.state.dayInput, 10)}-${this.state.yearInput}`;
        let date = moment(dateStr, "MMMM-D-YYYY", true);

        this.setState({isDateValid: date.isValid()}, this.checkState);
        this.props.callbackFromParent(date);
    };

    handleChange = (event, {name, value}) => {
        this.setState({
            [name]:value
        }, this.completeChange);
    };

    render() {
        return (
            <Form error={!this.state.isDateValid && this.state.monthInput && this.state.dayInput && this.state.yearInput}>
                <Form.Group >
                    <Dropdown
                        onChange={this.handleChange}
                        options={this.monthOptions}
                        placeholder='Choose an option'
                        fluid
                        selection

                        name='monthInput'
                    />
                    <Form.Input
                        placeholder='Day'
                        required
                        name='dayInput'
                        onChange={this.handleChange}
                        type="number"
                        min={1}
                        max={31}
                    />
                    <Form.Input
                        placeholder='Year'
                        required
                        name='yearInput'
                        onChange={this.handleChange}
                        type="number"

                        min={1900}
                        max={2020}
                    />
                </Form.Group>
                <Message
                    error
                    header='Invalid Date Of Birth'
                    content='Please enter a valid DOB.'
                />
            </Form>



        )
    }
}