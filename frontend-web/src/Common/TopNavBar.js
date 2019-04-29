import React from 'react'
import {
    Button,
    Container,
    Divider,
    Dropdown,
    Grid,
    Header,
    Image,
    List,
    Menu, Modal,
    Segment, TransitionablePortal,
} from 'semantic-ui-react'
import NewProjectForm from "../Project/ModalForm";
import {postProject} from "../actions";
import {connect} from "react-redux";


class TopNavBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false
        };
    }

    showModal = () => {
        this.setState({
            modalVisible: true
        });
    };

    closeModal = () => {
        this.setState({
            modalVisible: false
        });
    };

    handleModalSubmit = () => {
        this.props.dispatch(postProject(this.props.values));
        this.setState({
            modalVisible: false
        })
    };

    render() {
        return (
            <div>
                <Menu fixed='top' inverted>
                    <Container>
                        <Menu.Item as='a' header>
                            Motive.
                        </Menu.Item>
                        <Menu.Item as='a'>Home</Menu.Item>

                        <Dropdown item simple text='Profile'>
                            <Dropdown.Menu>
                                <Dropdown.Item>List Item</Dropdown.Item>
                                <Dropdown.Item>List Item</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Header>Header Item</Dropdown.Header>
                                <Dropdown.Item>List Item</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                        <Menu.Item>
                            <Button onClick={this.showModal}>Create Project</Button>
                        </Menu.Item>
                    </Container>
                </Menu>

                <TransitionablePortal open={this.state.modalVisible}  transition={{ animation:'fade up', duration: 500 }}>
                    <Modal open={true} onClose={this.closeModal} closeIcon>
                        <Modal.Header>Create a New Project</Modal.Header>
                        <Modal.Content>
                            <NewProjectForm/>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='grey' onClick={this.closeModal}>
                                Cancel
                            </Button>
                            <Button
                                positive
                                icon='checkmark'
                                labelPosition='right'
                                content="All good to go!"
                                onClick={this.handleModalSubmit}
                            />
                        </Modal.Actions>
                    </Modal>
                </TransitionablePortal>
            </div>

        );
    }
}

const mapStateToProps = state => {
    const { projectController } = state;
    const { isPosting, lastUpdated, result } = projectController;
    return state.form.newProject
        ? {
            values: state.form.newProject.values,
            submitSucceeded: state.form.newProject.submitSucceeded,
            isPosting: isPosting,
            result: result,
            lastUpdated: lastUpdated,
        }
        : {};
};

export default connect(mapStateToProps)(TopNavBar);

