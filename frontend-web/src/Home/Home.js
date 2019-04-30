import React, {Component} from 'react';
import './Home.css';
import {Button, Form, Grid, Header, Container, Segment} from 'semantic-ui-react'
import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'

class Home extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className='home'>
                <TopNavBar/>
                <h3>Home Page</h3>

                <Footer/>
            </div>
        );
    };
}

export default Home;