import React from 'react'
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
} from 'semantic-ui-react'

class TopNavBar extends React.Component {

    render() {
        return (
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
                </Container>
                </Menu>
        );
    }
}

export default TopNavBar;

