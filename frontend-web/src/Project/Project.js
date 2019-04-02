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

import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'

import SteveImage from '../Images/steve.jpg'

const FixedMenuLayout = () => (
  <div>

        <TopNavBar/>

        <Grid divided='vertically' style={{ marginTop: '5em' }} centered>
        <Grid.Row columns={2}>
        <Grid.Column width={2}>
            <Image style={{'border-radius':8}} src={SteveImage} size='small' />    
        </Grid.Column>
        <Grid.Column centered >
        <Header as='h1'>Project Title</Header>
            <p>This is a basic fixed menu template using fixed size containers.</p>
            <p>
                A text container is used for the main container, which is useful for single column layouts.
            </p>
        </Grid.Column>
        </Grid.Row>

        {/* <Grid.Row columns={3}>
        <Grid.Column>
            <Image src='/images/wireframe/paragraph.png' />
        </Grid.Column>
        <Grid.Column>
            <Image src='/images/wireframe/paragraph.png' />
        </Grid.Column>
        <Grid.Column>
            <Image src='/images/wireframe/paragraph.png' />
        </Grid.Column>
        </Grid.Row> */}
    </Grid>

    {/*<Container text >*/}

    {/*</Container>*/}
      <Footer/>
  </div>
);

export default FixedMenuLayout