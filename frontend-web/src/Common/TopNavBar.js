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

import {Link, withRouter} from "react-router-dom";
import UserProfile from "../UserProfile/UserProfile";
import {logout} from "./Auth/actions";

class TopNavBar extends React.Component {
    constructor(props) {
        super(props);
    }

    handleLogoutClick = () => {
        this.props.logout();
        this.props.history.push("/");
    };

    handleLoginClick = () => {
        this.props.history.push("/login");
    };

    render() {
        const isLoggedIn = this.props.currentUser;
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
                    {isLoggedIn ? (
                        <Menu.Menu position='right'>
                            <Menu.Item>
                                Welcome, {isLoggedIn.name}
                            </Menu.Item>

                            <Menu.Item>
                                <Button onClick={this.handleLogoutClick}>Log Out</Button>
                            </Menu.Item>
                        </Menu.Menu>
                    ) : (
                        <Menu.Item floated='right'>
                            <Button primary onClick={this.handleLoginClick}>Log In</Button>
                        </Menu.Item>
                    )}

                </Menu>

            </div>

        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logout())
    };
}

const mapStateToProps = state => {
    return {
        currentUser: state.authReducer.authController.currentUser,
    };
};

const TopNavComponent = connect(mapStateToProps, mapDispatchToProps) (TopNavBar);
export default withRouter(TopNavComponent)
