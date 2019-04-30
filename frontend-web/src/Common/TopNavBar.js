import React from 'react'
import {
    Button,
    Container,
    Dropdown,
    Menu, Modal,
    TransitionablePortal,
} from 'semantic-ui-react'
import NewProjectForm from "../Project/ModalForm";
import {postProject} from "../actions";
import {connect} from "react-redux";

import {Link, Route} from "react-router-dom";
import UserProfile from "../UserProfile/UserProfile";

class TopNavBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            submitButtonDisabled: true
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

    componentDidUpdate(oldProps) {
        const newProps = this.props;
        if(oldProps.values !== newProps.values) {
            const values = newProps.values;
            console.log(values);
            if((typeof values !== 'undefined') && ((values.hasOwnProperty('projectNameInput')) && (values.hasOwnProperty('descriptionInput'))
                && (values.hasOwnProperty('tags')) && (values.hasOwnProperty('taskList')))) {
                this.setState({
                    submitButtonDisabled: false
                })
            }

        }
    }

    render() {

        return (
            <div>
            <Menu fixed='top' inverted>
                <Container>
                <Menu.Item as='a' header>
                    Motive.
                </Menu.Item>

                <Menu.Item item simple text='Home'
                           as={Link} to='/'>
                    Home
                </Menu.Item>

                <Menu.Item item simple text='Profile'
                    as={Link} to='/profile'>
                    Profile
                </Menu.Item>

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
                            <Button
                                positive
                                icon='checkmark'
                                labelPosition='right'
                                content="All good to go!"
                                onClick={this.handleModalSubmit}
                                disabled={this.state.submitButtonDisabled}
                            />
                        </Modal.Actions>
                    </Modal>
                </TransitionablePortal>
            </div>

        );
    }
}

const mapStateToProps = state => {
    const { createProjectController } = state;
    const { isPosting, lastUpdated, result } = createProjectController;
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

