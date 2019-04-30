import React, {Component} from 'react';
import './Home.css';
import {Button, TransitionablePortal, Modal, Form, Grid, Header, Container, Segment} from 'semantic-ui-react'
import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'
import UpdateModal from "./UpdateModal";

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
                <h3>Home Page</h3>
                <TransitionablePortal open={this.state.modalVisible}  transition={{ animation:'fade up', duration: 500 }}>
                    <Modal open={true} onClose={this.closeModal} closeIcon>
                        <Modal.Header>Update</Modal.Header>
                        <Modal.Content>
                            <UpdateModal/>
                        </Modal.Content>
                    </Modal>
                </TransitionablePortal>
                <Button style={{ marginTop: '5em' }} onClick={this.showModal}>View Update</Button>
                <Footer/>
            </div>
        );
    };
}

export default Home;