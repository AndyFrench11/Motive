import {Dropdown} from 'semantic-ui-react'
import React from "react";

const statusOptions = [
    {
        key: 0,
        text: 'To Do',
        value: 1,
    },
    {
        key: 1,
        text: 'Doing',
        value: 2,
    },
    {
        key: 2,
        text: 'Done',
        value: 3,
    },
    {
        key: 3,
        text: 'None',
        value: 0,
    },
];

export default class StatusDropdown extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: this.props.task.status
        };
    }

    handleChange = (e, { value }) => {
        this.setState({selected: value});
        if (value === 0) {
            this.props.deleteStatusCallback();
        } else {
            this.props.setStatusCallback(value);
        }
    };

    render() {
        const {selected} = this.state;
        return (
            <Dropdown
                placeholder='Select Status'
                fluid
                selection
                options={statusOptions}
                value={selected}
                onChange={this.handleChange}
            />
        );
    }
}