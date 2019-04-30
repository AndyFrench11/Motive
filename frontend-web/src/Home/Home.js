import React, {Component} from 'react';
import './Home.css';
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
            modalVisible: false
        };
    }

    showModal = () => {
        this.setState({
            modalVisible: true
        })
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