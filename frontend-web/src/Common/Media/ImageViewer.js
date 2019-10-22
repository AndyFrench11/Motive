import React, {Component} from 'react';
import {Image} from "semantic-ui-react";

const serverURL = process.env.REACT_APP_BACKEND_ADDRESS;

class ImageViewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imageUrl: "",
        }
    }

    componentDidMount() {
        this.fetchImage(serverURL + `/projectupdate/${this.props.projectGuid}/media/${this.props.imageGuid}`);
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
                    //size='big'
                    fluid
                    src={this.state.imageUrl}
                />
            </div>
        );
    };
}
export default ImageViewer