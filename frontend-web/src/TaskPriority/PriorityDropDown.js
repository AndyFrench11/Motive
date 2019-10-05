import {Dropdown} from 'semantic-ui-react'
import React from "react";

const priorityOptions = [
    {
        key: 0,
        text: 'Low',
        value: 1,
    },
    {
        key: 1,
        text: 'Medium',
        value: 2,
    },
    {
        key: 2,
        text: 'High',
        value: 3,
    },
    {
        key: 3,
        text: 'None',
        value: 0,
    },
];

export default class PriorityDropdown extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: this.props.currentPriority
        };
    }

    handleChange = (e, { value }) => {
        this.setState({selected: value});
        if (value === 0) {
            this.props.deletePriorityCallback();
        } else {
            this.props.setPriorityCallback(value);
        }
    };

    render() {
        const {selected} = this.state;
        return (
            <Dropdown
                placeholder='Select Priority'
                fluid
                selection
                options={priorityOptions}
                value={selected}
                onChange={this.handleChange}
            />
        );
    }
}