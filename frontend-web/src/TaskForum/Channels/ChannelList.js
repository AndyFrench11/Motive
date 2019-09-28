import React from 'react'
import {
    Divider,
    Header,
    Input,
    Button,
    List,
} from 'semantic-ui-react'
import LoaderInlineCentered from "../../Common/Loader";
import ChannelItem from "./ChannelItem";

class ChannelList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            channelInputVisible: false,
            channelName: ''
        }
    }

    handleChange = (e, {name, value}) => {
        this.setState({[name]: value})
    };

    enter = (e) => {
        if (e.key === 'Enter') {
            this.addNewChannel();
        }
    };

    addNewChannel = () => {
        const {channelName} = this.state;
        channelName.trim();
        if (channelName.length !== 0) {
            // Create channel
            this.props.addChannelCallback(channelName);
            // Update state
            this.setState({
                channelName: '',
                channelInputVisible: false
            });
        }
    };

    showAddChannel = () => {
        this.setState({channelInputVisible: true});
    };

    createChannelButton() {
        return (
            <Button color='blue'
                    onClick={this.showAddChannel}
            >Add Channel
            </Button>
        );
    }

    createChannelSection() {
        const {channelInputVisible} = this.state;
        let click = this.addNewChannel;
        if (channelInputVisible) {
            return (
                <Input name='channelName'
                       value={this.state.channelName}
                       placeholder="Enter channel name..."
                       onChange={this.handleChange}
                       onKeyDown={this.enter}
                       action={{icon: 'check', onClick: click}}
                />
            )
        } else {
            return (
                <span>
                    {this.createChannelButton()}
                </span>
            )
        }
    }

    render() {
        const {channels} = this.props;

        if (channels === null || channels === undefined) {
            return (
                <div>
                    <Header as='h4'>Discussion Channels</Header>
                    <Divider/>
                    <List style={{marginTop: '5em'}} centered="true">
                        <LoaderInlineCentered/>
                    </List>
                </div>
            );
        } else if (channels.length === 0) {
            return (
                <div>
                    <Header as='h4'>Discussion Channels</Header>
                    <Divider/>
                    <List centered="true">
                        <List.Item>No channels yet!</List.Item>
                        {this.createChannelSection()}
                    </List>
                </div>
            );
        } else {
            return (
                <div>
                    <Header as='h4'>Discussion Channels</Header>
                    <Divider/>
                    <List size='large' centred="true">
                        {channels.map((channel) => (
                            <ChannelItem
                                key={channel.guid}
                                channel={channel}
                                deleteChannelCallback={this.props.deleteChannelCallback}
                                editChannelCallback={this.props.editChannelCallback}
                            />
                        ))}
                    </List>
                    {this.createChannelSection()}
                </div>
            );
        }
    }
}

export default ChannelList