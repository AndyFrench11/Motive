import React, {Component} from 'react';
import ReactPlayer from "react-player";

const serverURL = process.env.REACT_APP_BACKEND_ADDRESS;

class VideoPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoUrl: "",
            isPlaying: false
        };

        console.log(this.props.guid)
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
        const { guid } = this.props.match.params;
        this.fetchVideo(serverURL + "/resource/secure?resourceGuid=" + guid);
    }

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