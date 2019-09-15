import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, Label, Menu, Input, Button, Modal, Icon
} from 'semantic-ui-react'
import {connect} from "react-redux";
import uuidv4 from 'uuid/v4';
import { updateProjectImageIndex } from "./actions";

class CreateProjectUpdateModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = { 
        };

    }

    setSelectedImage = (event, {index}) => {
    };

    render() {

        const { modalOpen } = this.state;

        return (
            <Modal open={true} onClose={this.props.closeCallback} closeIcon>
                <Modal.Header>Update project photo</Modal.Header>
                <Modal.Content>
                    Hello there!
                </Modal.Content>
                <Modal.Actions>
                    <Button color='red' inverted onClick={this.props.closeCallback}>
                        <Icon name='remove'/> Cancel
                    </Button>
                    <Button color='green' inverted onClick={this.props.closeCallback}>
                        <Icon name='checkmark'/> Update
                    </Button>
                </Modal.Actions>
            </Modal>
        );
  }
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

const mapStateToProps = state => {
    return {

    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateProjectUpdateModal);
