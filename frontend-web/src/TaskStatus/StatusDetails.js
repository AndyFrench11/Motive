import React from "react";
import Label from "semantic-ui-react/dist/commonjs/elements/Label";

export default class StatusDetails extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        const {status} = this.props;

        switch (status) {
            case 1:
                // To do
                return (
                    <Label color='orange'
                           horizontal>
                        Status
                        <Label.Detail>To do</Label.Detail>
                    </Label>
                );
            case 2:
                // Doing
                return (
                    <Label color='teal'
                           horizontal>
                        Status
                        <Label.Detail>Doing</Label.Detail>
                    </Label>
                );
            case 3:
                // Done
                return (
                    <Label color='green'
                           horizontal>
                        Status
                        <Label.Detail>Done!</Label.Detail>
                    </Label>
                );
            default:
                return (
                    <Label>Status
                        <Label.Detail>None</Label.Detail>
                    </Label>
                );
        }
    }
}