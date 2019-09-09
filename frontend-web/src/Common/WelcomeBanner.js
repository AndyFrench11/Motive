import React from 'react'
import {Container, Divider, Grid, Header, Image, List, Segment} from "semantic-ui-react";

class WelcomeBanner extends React.Component {
    render() {
        return (
            <div id="motive-title" className="ui inverted vertical center aligned segment">
                <Container text>
                    <Header
                        as='h1'
                        content='Welcome to Motive.'
                        inverted
                        style={{
                            fontSize: '4em',
                            fontWeight: 'normal',
                            marginBottom: 0,
                            marginTop: '1.3em',
                        }}
                    />
                    <Header
                        as='h2'
                        content='What is your Motive?'
                        inverted
                        style={{
                            fontSize: '1.7em',
                            fontWeight: 'normal',
                            marginTop: '1em',
                            marginBottom: '2em',
                        }}
                    />
                </Container>
            </div>
        );
    }
}

export default WelcomeBanner;