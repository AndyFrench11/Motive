import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, Label, Menu, Input, Button, Icon, Card, Modal, List, Comment, Form
} from 'semantic-ui-react'

const getHeaderStyle = () => ({
    padding: 12
});

class TaskForum extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            channels: [],
            selectedChannel: null
        };
    }

    channels() {
        return (
            <div>
                <Grid divided='vertically'>
                    <Grid.Row>
                        Random
                    </Grid.Row>
                    <Grid.Row>
                        General
                    </Grid.Row>
                    <Grid.Row>
                        New
                    </Grid.Row>
                    <Grid.Row>
                        <Button>Add Channel</Button>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }

    messages() {
        return (
            <Comment.Group>
                <Comment>
                    <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                    <Comment.Content>
                        <Comment.Author>Joe Henderson</Comment.Author>
                        <Comment.Metadata>
                            <div>1 day ago</div>
                        </Comment.Metadata>
                        <Comment.Text>
                            <p>
                                The hours, minutes and seconds stand as visible reminders that your
                                effort put them all there.
                            </p>
                            <p>
                                Preserve until your next run, when the watch lets you see how
                                Impermanent your efforts are.
                            </p>
                        </Comment.Text>
                        <Comment.Actions>
                            <Comment.Action>Reply</Comment.Action>
                        </Comment.Actions>
                    </Comment.Content>
                </Comment>

                <Comment>
                    <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                    <Comment.Content>
                        <Comment.Author>Christian Rocha</Comment.Author>
                        <Comment.Metadata>
                            <div>2 days ago</div>
                        </Comment.Metadata>
                        <Comment.Text>I re-tweeted this.</Comment.Text>
                        <Comment.Actions>
                            <Comment.Action>Reply</Comment.Action>
                        </Comment.Actions>
                    </Comment.Content>
                </Comment>
                <Form reply>
                    <Form.TextArea />
                    <Button content='Add Comment' labelPosition='left' icon='edit' primary />
                </Form>
            </Comment.Group>
        )
    }

    render() {
        const {task} = this.props;
        return (
            <div>
                <Grid celled>
                    <Grid.Row color='black' padded>
                        <Header
                            as='h3'
                            style={getHeaderStyle()}
                            inverted>
                            {task.name}
                        </Header>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column width={4}>
                            {this.channels()}
                        </Grid.Column>
                        <Grid.Column width={12}>
                            {this.messages()}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}

export default TaskForum;