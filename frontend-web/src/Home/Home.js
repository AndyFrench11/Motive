import React, {Component} from 'react';
import PersonImage from '../Images/stevie.jpg';
import {
    Button,
    TransitionablePortal,
    Modal,
    Item,
    Icon,
    Label,
    Container,
    Segment,
    Placeholder
} from 'semantic-ui-react'
import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'
import UpdateModal from "./UpdateModal";
import _ from 'lodash'
import axios from 'axios';
import { Route } from 'react-router-dom';

const serverUrl = process.env.REACT_APP_BACKEND_ADDRESS;


const paragraph =
    <Placeholder>
        <Placeholder.Paragraph>
            <Placeholder.Line/>
            <Placeholder.Line/>
            <Placeholder.Line/>
            <Placeholder.Line/>
            <Placeholder.Line/>
            <Placeholder.Line/>
            <Placeholder.Line/>
            <Placeholder.Line/>
            <Placeholder.Line/>
            <Placeholder.Line/>
        </Placeholder.Paragraph>
    </Placeholder>;


const UpdateItem = props => (
    <Item>
        <Item.Image src={PersonImage}/>

        <Item.Content>
            <Item.Header as='a'>{props.title}</Item.Header>
            <Item.Meta>
                <span>Update by {props.author}</span>
            </Item.Meta>
            <Item.Description>
                {paragraph}
            </Item.Description>
        </Item.Content>
    </Item>

);

class Home extends Component {
    constructor(props) {
      super(props);

      this.state = {
        users: [],
        modalVisible: false
      };

    }

    componentDidMount() {
      console.log(serverUrl)
      axios.get(serverUrl + "/person")
            .then(response =>
              this.setState({
                users: response.data
              }
            ))
            .catch(error => {
                console.log("The server is not running!");
                console.log(error)
            })
    }

    userlist() {
        console.log(this.state.users)
      return this.state.users.map((item, key) =>

          <Route render={({ history }) => (
            <button
              type='button'
              onClick={() => { history.push(`/profile/${item.guid}/`) }}
            >
              {item.firstName} {item.lastName}
            </button>
          )} />
        )
    }

    showModal = () => {
        this.setState({ modalVisible: true })
    };

    closeModal = () => {
        this.setState({
            modalVisible: false
        })

    };

    render() {

        return (
            <div className='home'>
                <TopNavBar/>
                <h3 style={{marginTop: '5em'}}> All Users:</h3>
                {this.userlist()}
                <TransitionablePortal open={this.state.modalVisible} transition={{animation: 'fade up', duration: 500}}>
                    <Modal open={true} onClose={this.closeModal} closeIcon>
                        <Modal.Content>
                            <UpdateModal/>
                        </Modal.Content>
                    </Modal>
                </TransitionablePortal>
                <Container>
                    <Button style={{marginTop: '5em'}} onClick={this.showModal}>View Update</Button>
                    <Item.Group divided>
                        {_.times(8, i => (
                            <UpdateItem author={"Stevie"} title={"Update One"}/>
                        ))}
                    </Item.Group>
                </Container>

                <Footer/>
            </div>
        );
    };
}

export default Home;