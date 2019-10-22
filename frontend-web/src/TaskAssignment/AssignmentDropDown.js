import React from 'react'
import { Dropdown } from 'semantic-ui-react'

export default class AssignmentDropDown extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: this.props.currentAssignee
        };

        this.assigneeOptions = this.props.projectOwners.map((user, index) => {
            return {
                key: user.guid,
                text: user.firstName,
                value: user.guid
            }
        });

    }

    handleChange = (e, { value }) => {
        this.setState({selected: value});
        this.props.setAssigneeCallback(value);
    };

    render() {
        const {selected} = this.state;
        return (
            <Dropdown
                placeholder='Select Assignee'
                fluid
                selection
                options={this.assigneeOptions}
                value={selected}
                onChange={this.handleChange}
            />
        );
    }
}