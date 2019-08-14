import React from 'react'
import {
    Button,
    Container,
    Dropdown,
    Menu,
    Modal,
    TransitionablePortal,
} from 'semantic-ui-react'
import NewProjectForm from "../Project/ModalForm";
import {postProject} from "../actions";
import {connect} from "react-redux";

import {Link, Route} from "react-router-dom";
import UserProfile from "../UserProfile/UserProfile";

class TopNavBar extends React.Component {

    render() {

        return (
            <div>
                <Menu fixed='top' inverted>
                    <Container>
                        <Menu.Item item simple text='Home'
                                   as={Link} to='/'>
                            Motive.
                        </Menu.Item>

                        <Menu.Item item simple text='Home'
                                   as={Link} to='/home'>
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

                    </Container>
                </Menu>

            </div>

        );
    }
}


export default TopNavBar;

