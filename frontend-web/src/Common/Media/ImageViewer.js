import React, {Component} from 'react';
import {Image} from "semantic-ui-react";

class ImageViewer extends Component {
    constructor(props) {
        super(props);

        this.fetchImage("https://localhost:8081/api/upload?resourceGuid=" + this.props.imageGuid);

        this.state = {
            imageUrl: "",
        }
    }

    readResponseAsBlob = (response) => {
        return response.blob();
    };

    showVideo = (responseAsBlob) => {
        let imageUrl = URL.createObjectURL(responseAsBlob);
        this.setState({imageUrl: imageUrl});
    };

    processError = (error) => {
        console.log(error);
    };

    fetchImage = (pathToResource) => {
        fetch(pathToResource, {credentials: 'include'})
            .then(this.readResponseAsBlob)
            .then(this.showVideo)
            .catch(this.processError)
    };

    render() {
        return (
            <div>
                <Image
                    size={this.props.size}
                    src={this.state.imageUrl}
                />
            </div>
        );
    };
}
export default ImageViewer