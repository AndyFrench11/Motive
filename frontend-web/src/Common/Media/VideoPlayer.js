import React, {Component} from 'react';
import ReactPlayer from "react-player";
import LoaderInlineCentered from "../../Common/Loader";
import {Grid} from "semantic-ui-react";

const serverURL = process.env.REACT_APP_BACKEND_ADDRESS;

class VideoPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoUrl: "",
            isPlaying: false
        };
    }

    readResponseAsBlob = (response) => {
        return response.blob();
    };

    showVideo = (responseAsBlob) => {
        let videoUrl = URL.createObjectURL(responseAsBlob);
        this.setState({videoUrl: videoUrl, isPlaying: true});
    };

    processError = (error) => {
        console.log(error);
    };

    fetchVideo = (pathToResource) => {
        fetch(pathToResource, {credentials: 'include'})
            .then(this.readResponseAsBlob)
            .then(this.showVideo)
            .catch(this.processError)
    };

    componentDidMount() {
        this.fetchVideo(serverURL + `/projectupdate/${this.props.projectGuid}/media/${this.props.videoGuid}`);
    }

    render() {
        const {videoUrl} = this.state;
        if(videoUrl === "") {
            return (
                <Grid divided='vertically' style={{marginTop: '5em', marginBottom: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            );
        } else {
            return (
                <div>
                    <ReactPlayer
                        url={videoUrl}
                        controls
                        playing={this.state.isPlaying}
                        volume={0}
                    />
                </div>
            );
        }
    };
}
export default VideoPlayer