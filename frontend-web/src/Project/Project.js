import React from 'react'
import {
    Divider, Grid, Header, Image, Button, Modal, TransitionablePortal,
} from 'semantic-ui-react'

import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'
import BookImage from '../Images/Hobbies Icons/010-book.png'

class ProjectPageLayout extends React.Component {

    render() {

    return (
      <div>
        <TopNavBar/>

          <Header as='h1'>{this.props.result}</Header>

        <Grid divided='vertically' style={{ marginTop: '5em' }} centered>
        <Grid.Row columns={2}>
        <Grid.Column width={2}>
            <Image style={{'border-radius':8}} src={BookImage} size='small' />
        </Grid.Column>
        <Grid.Column centered>
        <Header as='h1'></Header>
            <p></p>

        </Grid.Column>
        </Grid.Row>

        <Divider/>

        </Grid>

      <Footer/>
    </div>
    );
  }
}


export default ProjectPageLayout;