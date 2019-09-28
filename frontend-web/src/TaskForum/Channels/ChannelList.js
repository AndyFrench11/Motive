import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, Label, Menu, Input, Button, Icon, Card, Modal, List, Comment, Form
} from 'semantic-ui-react'
import LoaderInlineCentered from "../../Common/Loader";

class ChannelList extends React.Component {

    constructor(props) {
        super(props);
    }

    createChannelButton() {
        return (
            <Button>Add Channel</Button>
        );
    }

    render() {
        const {channels} = this.props;

        if (channels === null || channels === undefined) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            );
        } else if (channels.length === 0) {
            return (
                <Grid divided='vertically'>
                    <Grid.Row>No channels yet!</Grid.Row>
                    <Grid.Row>{this.createChannelButton()}</Grid.Row>
                </Grid>
            );
        } else {
            return (
                <Grid divided='vertically'>
                    {channels.map((channel) => (
                        <Grid.Row key={channel.guid}>{channel.name}</Grid.Row>
                    ))}
                    {this.createChannelButton()}
                </Grid>
            );
        }
    }
}

export default ChannelList