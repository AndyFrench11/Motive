import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, Label, Menu, Input, Button, Modal, Icon
} from 'semantic-ui-react'
import {connect} from "react-redux";
import uuidv4 from 'uuid/v4';
import { updateProjectImageIndex } from "./actions";

class UpdateProjectImageModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = { 
            selectedImageIndex: this.props.selectedImageIndex,
            modalOpen: true
        };

    }

    setSelectedImage = (event, {index}) => {
        this.setState({
            selectedImageIndex: index
        });

    };

    renderPhotos = () => {
        var photoList = Object.keys(this.props.images);

        return (
            <Segment style={{overflow: 'auto', maxHeight: 400 }}>
                <Label attached='top' size="medium">Project Photo</Label>
                <Image.Group size='tiny'>
                    {photoList.map((photo, index) =>
                        <Button basic toggle active={index == this.state.selectedImageIndex} index={index} onClick={this.setSelectedImage}>
                            <Image src={this.props.images[photoList[index]]} fluid/>
                        </Button>
                    )}
                </Image.Group>
            </Segment>
        )
    };

    updateProjectImage = () => {
        this.props.updateSelectedImageIndexCallback(this.state.selectedImageIndex)
        this.props.updateProjectImageIndex(this.props.projectGuid, this.state.selectedImageIndex)
        this.closeModal()
    }

    closeModal = () => {
        this.setState({ modalOpen: false });
        this.props.closeCallback();
    }

    render() {

        return (
            <Modal open={this.state.modalOpen}>
            <Modal.Header>Update project photo</Modal.Header>
            <Modal.Content>
                {this.renderPhotos()}
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' inverted onClick={this.closeModal}>
                    <Icon name='remove'/> Cancel
                </Button>
                <Button color='green' inverted disabled={this.state.selectedImageIndex === this.props.selectedImageIndex} onClick={this.updateProjectImage}>
                    <Icon name='checkmark'/> Update
                </Button>
            </Modal.Actions>
          </Modal>
        );
  }
}

function mapDispatchToProps(dispatch) {
    return {
        updateProjectImageIndex: (projectGuid, imageIndex) => dispatch(updateProjectImageIndex(projectGuid, imageIndex)),
    };
}

const mapStateToProps = state => {
    const { projectDetailsReducer } = state;
    const { projectDetailsController } = projectDetailsReducer;
    const { isUpdating, lastUpdated, result } = projectDetailsController;
    return {
        isUpdating: isUpdating,
        result: result,
        lastUpdated: lastUpdated,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProjectImageModal);
