import React from 'react'
import {
    Button,
    Container,
    Dropdown,
    Menu,
    Modal,
    TransitionablePortal,
} from 'semantic-ui-react'

import {Link, withRouter} from "react-router-dom";
import {logout} from "./Auth/actions";
import {connect} from "react-redux";
import Redirect from "react-router-dom/es/Redirect";

class TopNavBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            goToLogin: false
        }
    }

    handleLogoutClick = () => {
        // Fire logout then set state to reroute to logout
        this.props.logout().then(
            this.props.history.replace('/login')
        );
    };

    handleLoginClick = () => {
        this.props.history.push("/login");
    };

    render() {
        const currentUser = this.props.currentUser;

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


                    </Container>
                    {currentUser ? (
                        <Menu.Menu position='right'>
                            <Menu.Item>
                                Welcome, {currentUser.firstName} {currentUser.lastName}
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
        currentUser: state.authReducer.authController.currentUser
    };
};

const TopNavComponent = connect(mapStateToProps, mapDispatchToProps) (TopNavBar);
export default withRouter(TopNavComponent)
