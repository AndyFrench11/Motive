import React from "react";
import Label from "semantic-ui-react/dist/commonjs/elements/Label";

export default class AssignmentDetails extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        const {assignee} = this.props;
        if (assignee!== null && assignee!== undefined) {
            return (
                <Label image>
                    <img src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                    {assignee.firstName}
                </Label>
            );
        }
    }
}