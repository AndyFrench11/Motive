import React from 'react'
import {
    Button, Modal, Icon, Form, TextArea, Progress, Divider, Dropdown, Input
} from 'semantic-ui-react'
import {connect} from "react-redux";
import uuidv4 from 'uuid/v4';
import { updateProjectImageIndex } from "./actions";

const friendOptions = [
    {
      key: 'Jenny Hess',
      text: 'Jenny Hess',
      value: 'Jenny Hess',
      image: { avatar: true, src: '/images/avatar/small/jenny.jpg' },
    },
    {
      key: 'Elliot Fu',
      text: 'Elliot Fu',
      value: 'Elliot Fu',
      image: { avatar: true, src: '/images/avatar/small/elliot.jpg' },
    },
    {
      key: 'Stevie Feliciano',
      text: 'Stevie Feliciano',
      value: 'Stevie Feliciano',
      image: { avatar: true, src: '/images/avatar/small/stevie.jpg' },
    },
    {
      key: 'Christian',
      text: 'Christian',
      value: 'Christian',
      image: { avatar: true, src: '/images/avatar/small/christian.jpg' },
    },
    {
      key: 'Matt',
      text: 'Matt',
      value: 'Matt',
      image: { avatar: true, src: '/images/avatar/small/matt.jpg' },
    },
    {
      key: 'Justen Kitsune',
      text: 'Justen Kitsune',
      value: 'Justen Kitsune',
      image: { avatar: true, src: '/images/avatar/small/justen.jpg' },
    },
  ]

class CreateProjectUpdateModal extends React.Component {

    constructor(props) {
        super(props);

        this.taskOptions = this.props.taskOptions.map((task, index) => {
            return {
                key: task.name,
                text: task.name,
                value: task.name
            }
        });

        this.state = { 
        };

    }

    setSelectedImage = (event, {index}) => {
    };

    render() {

        return (
            <Modal open={true} onClose={this.props.closeCallback} closeIcon>
                <Modal.Header>Create a new update.</Modal.Header>
                <Modal.Content>
                    <div>
                        <Form>
                            <TextArea placeholder='Tell us more...' />
                            <Divider/>

                            <Dropdown
                                placeholder='Does this relate to a task?'
                                fluid
                                selection
                                options={this.taskOptions}
                                clearable
                            />

                            <Divider/>
                        </Form>

                        <Progress percent={25} success style={{'marginTop': 10}}>
                        </Progress>
                    </div>
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
