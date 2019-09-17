import React from 'react'
import {
    Button, Modal, Icon, Form, TextArea, Progress, Divider, Dropdown, Input, Image, Segment, Grid, Header, Label, Comment, Checkbox
} from 'semantic-ui-react'
import {connect} from "react-redux";
import uuidv4 from 'uuid/v4';
import { postProjectUpdate } from "./actions";
import TrophyImage from '../../../ProjectImages/image16.png';
import ProjectUpdateContent from './ProjectUpdateContent';

class ProjectUpdate extends React.Component {

    constructor(props) {
        super(props);

        this.state = { 
            updating: false
        };

    }

    handleEditUpdateClicked = () => {
        this.setState({updating: !this.state.updating});
    }

    handleDeleteUpdateClicked = () => {
        
        this.props.removeUpdateCallback(this.props.index)
        // Do the backend call!

    }


    render() {

        const { update, projectName, tags } = this.props;
        const { relatedPerson, relatedTask, content } = update;

        const options = [
            { key: '1', text: 'Edit Update', icon: 'edit', onClick: this.handleEditUpdateClicked },
            { key: '2', text: 'Delete Update', icon: 'delete', onClick: this.handleDeleteUpdateClicked },
          ]

        const trigger = (
            <span>
                <Icon name='ellipsis horizontal' floated='right' />
            </span>
            )

        return (
            <Segment style={{'marginLeft': '15em', 'marginRight': '15em'}}>
                <Grid columns='four' divided>
                    <Grid.Column width={2}>
                        <Image avatar src='https://react.semantic-ui.com/images/avatar/large/matthew.png' size="tiny"/>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Header size='large'>Update from {relatedPerson.firstName}</Header>
                    </Grid.Column>
                    <Grid.Column>
                        <Grid.Row>
                            <Header size='large'>{projectName}</Header>    
                        </Grid.Row>
                        <Grid.Row>
                            {tags.map((tag, index) =>
                                <Label key={index} >
                                    #{tags[index].name}
                                </Label>
                            )}
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column floated='right'>
                        <Label attached='top right'>
                            <Dropdown
                                trigger={trigger}
                                options={options}
                                pointing='top left'
                                icon={null}
                            />
                        </Label>
                    </Grid.Column>
                </Grid>
                <Divider/>
                <Grid columns='2' divided>
                    <Grid.Column width={10} fluid>
                        {relatedTask !== null && (

                            relatedTask.completed ? 
                                    <Grid.Row>
                                        <Segment>
                                            <Grid>
                                                <Grid.Column width={2}>
                                                    <Image src={TrophyImage} size='large' rounded />
                                                </Grid.Column>
                                                <Grid.Column width={10}>
                                                    <Header style={{'marginTop': 3}} size='medium'>Task Completed: {relatedTask.name}</Header>
                                                </Grid.Column>
                                            </Grid>
                                        </Segment>
                                    </Grid.Row>
                            :
                                    <Grid.Row>
                                        <Segment>
                                            <Grid>
                                                <Grid.Column width={2}>
                                                    <Icon size='large' name='tasks'/>
                                                </Grid.Column>
                                                <Grid.Column width={10}>
                                                    <Header style={{'marginTop': 3}} size='medium'>Task: {relatedTask.name}</Header>
                                                </Grid.Column>
                                            </Grid>
                                        </Segment>
                                    </Grid.Row>
                        )



                        }
                        {relatedTask !== null &&
                            <Divider/>
                        }
                        <ProjectUpdateContent content={content} updating={this.state.updating}/>
                    </Grid.Column>
                    <Grid.Column width={6} floated="right">
                        <Segment style={{overflow: 'auto', maxHeight: 300 }}>
                            <Comment.Group>
                                <Header as='h3' dividing>
                                Comments
                                </Header>

                                <Comment>
                                <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                                <Comment.Content>
                                    <Comment.Author as='a'>Matt</Comment.Author>
                                    <Comment.Metadata>
                                    <div>Today at 5:42PM</div>
                                    </Comment.Metadata>
                                    <Comment.Text>How artistic!</Comment.Text>
                                    <Comment.Actions>
                                    <Comment.Action>Reply</Comment.Action>
                                    </Comment.Actions>
                                </Comment.Content>
                                </Comment>

                                <Comment>
                                <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
                                <Comment.Content>
                                    <Comment.Author as='a'>Elliot Fu</Comment.Author>
                                    <Comment.Metadata>
                                    <div>Yesterday at 12:30AM</div>
                                    </Comment.Metadata>
                                    <Comment.Text>
                                    <p>This has been very useful for my research. Thanks as well!</p>
                                    </Comment.Text>
                                    <Comment.Actions>
                                    <Comment.Action>Reply</Comment.Action>
                                    </Comment.Actions>
                                </Comment.Content>
                                <Comment.Group>
                                    <Comment>
                                    <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/jenny.jpg' />
                                    <Comment.Content>
                                        <Comment.Author as='a'>Jenny Hess</Comment.Author>
                                        <Comment.Metadata>
                                        <div>Just now</div>
                                        </Comment.Metadata>
                                        <Comment.Text>Elliot you are always so right :)</Comment.Text>
                                        <Comment.Actions>
                                        <Comment.Action>Reply</Comment.Action>
                                        </Comment.Actions>
                                    </Comment.Content>
                                    </Comment>
                                </Comment.Group>
                                </Comment>

                                <Comment>
                                <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/joe.jpg' />
                                <Comment.Content>
                                    <Comment.Author as='a'>Joe Henderson</Comment.Author>
                                    <Comment.Metadata>
                                    <div>5 days ago</div>
                                    </Comment.Metadata>
                                    <Comment.Text>Dude, this is awesome. Thanks so much</Comment.Text>
                                    <Comment.Actions>
                                    <Comment.Action>Reply</Comment.Action>
                                    </Comment.Actions>
                                </Comment.Content>
                                </Comment>

                                <Form reply>
                                <Form.TextArea />
                                <Button content='Add Reply' labelPosition='left' icon='edit' primary />
                                </Form>
                            </Comment.Group>
                        </Segment> 
                    </Grid.Column>

                </Grid>

                <Divider/>

                <Progress percent={25} success style={{'marginTop': '1em'}}>
                    INSERT TIMELINE HERE
                    </Progress>

            </Segment>

        );
  }
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

const mapStateToProps = state => {

};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectUpdate);
