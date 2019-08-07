import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, Label, Menu, Transition, List, Button, Icon, Card,
} from 'semantic-ui-react'

import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'
import BookImage from './ProjectImages/image15.png'
import {connect} from "react-redux";
import {fetchProject} from "../actions";
import LoaderInlineCentered from "../Common/Loader";


class ProjectPageLayout extends React.Component {
    state = { activeMenuItem: "Updates" };

    handleItemClick = (e, { name }) => this.setState({ activeMenuItem: name });
    handleTaskButtonClick = () => this.setState({ activeTaskButton: !this.state.activeTaskButton });


    componentDidMount() {
        const { dispatch } = this.props;
        const { userguid, projectguid } = this.props.match.params;
        dispatch(fetchProject(projectguid, userguid));
    }

    checkRender() {
        if(typeof this.props.result === 'undefined') {
            return(<Grid divided='vertically' style={{marginTop: '5em'}} centered>
                <LoaderInlineCentered/>
            </Grid>)
        } else {
            const { result } = this.props;
            const { activeMenuItem, activeTaskButton } = this.state;

            return (<div>
                <Grid divided='vertically' style={{ marginTop: '5em' }} centered>
                    <Grid.Row columns={3}>
                        <Grid.Column width={2}>
                            <Image style={{'border-radius':8}} src={BookImage} size='small' />
                        </Grid.Column>
                        <Grid.Column centered>
                            <Grid.Row>
                                <Header as='h1'>{result.name}</Header>
                            </Grid.Row>
                            <Grid.Row>
                                <p>{result.description}</p>
                            </Grid.Row>
                            <Grid.Row>
                                {result.tagList.map((tag, index) =>
                                    <Label key={index} >
                                        #{result.tagList[index].name}
                                    </Label>
                                )}
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Row>
                                    <br/>
                                    <Button icon labelPosition='left'>
                                        <Icon name='edit' />
                                        Edit Project
                                    </Button>
                                </Grid.Row>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                    <Divider style={{ marginLeft: '5em', marginRight: '5em'}}/>


                    <Menu pointing secondary style={{ marginLeft: '5em', marginRight: '5em'}}>
                        <Menu.Item
                            name='Updates'
                            active={activeMenuItem === 'Updates'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Tasks'
                            active={activeMenuItem === 'Tasks'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Highlights'
                            active={activeMenuItem === 'Highlights'}
                            onClick={this.handleItemClick}
                        />
                    </Menu>

                    {activeMenuItem === "Tasks" &&
                        <Segment style={{ marginLeft: '5em', marginRight: '5em'}}>
                            <List selection divided size='large' verticalAlign='middle'>
                                {result.taskList.map((task, index) =>
                                    <List.Item key={index}>
                                        <List.Content floated='right'>

                                            <Button basic circular toggle active={activeTaskButton} onClick={this.handleTaskButtonClick}
                                                    icon='check'>
                                            </Button>

                                        </List.Content>
                                        <Image avatar src='https://react.semantic-ui.com/images/avatar/small/helen.jpg' />
                                        <List.Content>
                                            {result.taskList[index].name}
                                        </List.Content>
                                    </List.Item>
                                )}
                            </List>
                        </Segment>
                    }

                    {activeMenuItem === "Updates" &&
                        <Segment style={{ marginLeft: '5em', marginRight: '5em'}}>
                            <Card>
                                <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' />
                                <Card.Content>
                                    <Card.Header>Matthew</Card.Header>
                                    <Card.Meta>
                                        <span className='date'>Joined in 2015</span>
                                    </Card.Meta>
                                    <Card.Description>Matthew is a musician living in Nashville.</Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <a>
                                        <Icon name='user' />
                                        22 Friends
                                    </a>
                                </Card.Content>
                            </Card>
                        </Segment>
                    }

                    {activeMenuItem === "Highlights" &&
                        <Segment style={{ marginLeft: '5em', marginRight: '5em'}}>
                            Highlights
                        </Segment>
                    }

            </div>
            )
        }
    }

    render() {

        const { isRetrieving, result, lastUpdated } = this.props;

        return (
          <div>
            <TopNavBar/>
              {this.checkRender()}

          <Footer/>
        </div>
        );
  }
}

const mapStateToProps = state => {
    const { projectController } = state;
    const { isRetrieving, lastUpdated, result } = projectController;
    return {
        isRetrieving: isRetrieving,
        result: result,
        lastUpdated: lastUpdated,
    };
};

export default connect(mapStateToProps)(ProjectPageLayout);

