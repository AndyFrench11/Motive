import React from "react";
import Label from "semantic-ui-react/dist/commonjs/elements/Label";

export default class PriorityDetails extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        const {priority} = this.props;

        switch (priority) {
            case 1:
                // Low
                return (
                    <Label color='green'
                           horizontal>
                        Priority
                        <Label.Detail>Low</Label.Detail>
                    </Label>
                );
            case 2:
                // Medium
                return (
                    <Label color='yellow'
                           horizontal>
                        Priority
                        <Label.Detail>Medium</Label.Detail>
                    </Label>
                );
            case 3:
                // High
                return (
                    <Label color='red'
                           horizontal>
                        Priority
                        <Label.Detail>High!</Label.Detail>
                    </Label>
                );
            default:
                return (
                    <Label>Priority
                        <Label.Detail>None</Label.Detail>
                    </Label>
                );
        }
    }
}