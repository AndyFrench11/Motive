import React from 'react'
import {Button, Segment, Confirm, Input, Header, Grid} from 'semantic-ui-react'
import {Route} from 'react-router-dom';
import Moment from 'moment';
import CardText from "reactstrap/es/CardText";
import ButtonGroup from "react-bootstrap/es/ButtonGroup";

class ChannelItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            channel: this.props.channel,
            editing: false,
            newName: '',
            confirmDeleteOpen: false
        }
    }

    startEdit = () => {
        const {channel} = this.state;
        this.setState({editing: true});
        this.setState({newName: channel.name});
    };

    handleChange = (e, {name, value}) => {
        this.setState({[name]: value})
    };

    enter = (e) => {
        if (e.key === 'Enter') {
            this.edit();
        }
    };

    edit = () => {
        const {channel, newName} = this.state;
        newName.trim();
        if (newName.length !== 0) {
            // Edit channel name callback
            this.props.editChannelCallback(channel, newName)
            // Update state
                .then(() => {
                    this.setState({editing: false});
                    channel.name = newName;
                    this.setState({channel: channel});
                });
        }
    };

    showDeleteModal = () => this.setState({confirmDeleteOpen: true});

    cancelDelete = () => this.setState({confirmDeleteOpen: false});

    confirmDelete = () => {
        const {channel} = this.state;
        this.setState({confirmDeleteOpen: false});
        this.props.deleteChannelCallback(channel);
    };

    getDeleteModal = () => {
        const {confirmDeleteOpen} = this.state;

        return (
            <Confirm
                open={confirmDeleteOpen}
                content='Are you sure you want to delete this channel?'
                header='Delete Channel'
                cancelButton='No'
                confirmButton="Yes"
                onCancel={this.cancelDelete}
                onConfirm={this.confirmDelete}
            />
        );
    };

    getChannelText() {
        const {channel, editing} = this.state;
        const {name} = channel;

        if (editing) {
            return (
                <Input
                    size='small'
                    onChange={this.handleChange}
                    onKeyDown={this.enter}
                    action
                    defaultValue={name}
                >
                    <input/>
                    <Button icon='check' onClick={this.edit} size='medium'/>
                </Input>
            );
        } else {
            return (
                <Header as='h5'
                        onClick={this.startEdit}>
                    {channel.name}
                </Header>
            );
        }
    }

    render() {
        const {channel} = this.state;
        const {created} = channel;
        const dateTime = new Date(created);
        const momentTime = Moment(dateTime).calendar();

        return (
            <Segment>
                <Grid>
                    <Grid.Column width={12}>
                        {this.getChannelText()}
                        <Header as='h6' color='grey'>Created: {momentTime}</Header>
                    </Grid.Column>
                    <Grid.Column width={1}>
                        <ButtonGroup vertical>
                            <Button
                                basic
                                size='mini'
                                color='blue'
                                icon='edit outline'
                                onClick={this.startEdit}
                            >
                            </Button>
                            <Button
                                basic
                                size='mini'
                                color='red'
                                icon='cancel'
                                onClick={this.showDeleteModal}
                            >
                            </Button>
                        </ButtonGroup>
                    </Grid.Column>
                </Grid>
                {this.getDeleteModal()}
            </Segment>
        )
    }
}

export default ChannelItem;