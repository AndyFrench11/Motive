import React, {Component} from 'react';
import ReactPlayer from "react-player";

class VideoPlayer extends Component {
    constructor(props) {
        super(props);

        this.fetchVideo("https://localhost:8081/api/upload?resourceGuid=" + "65ef7095-0062-4fc9-a660-e7791f54c79e");

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
                <ReactPlayer
                    url={this.state.videoUrl}
                    controls
                    playing={this.state.isPlaying}
                    volume={0}
                />
            </div>
        );
    };
}
export default VideoPlayer