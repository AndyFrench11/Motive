import React, {Component} from 'react';
import ReactPlayer from "react-player";

class VideoPlayer extends Component {
    constructor(props) {
        super(props);

        this.fetchVideo("https://localhost:8081/api/upload?resourceGuid=" + this.props.videoGuid);

        this.state = {
            videoUrl: "",
            isPlaying: false
        }
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

    render() {
        return (
            <div>
                <ReactPlayer url={this.state.videoUrl} controls playing={this.state.isPlaying} />
            </div>
        );
    };
}
export default VideoPlayer