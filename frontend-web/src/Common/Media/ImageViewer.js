import React, {Component} from 'react';
import {Image, Grid} from "semantic-ui-react";
import LoaderInlineCentered from "../../Common/Loader";

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
        const {imageUrl} = this.state;
        if(imageUrl === "") {
            return (
                <Grid divided='vertically' style={{marginTop: '5em', marginBottom: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            );
        } else {
            return (
                <div>
                    <Image
                        size='big'
                        src={imageUrl}
                    />
                </div>
            );
        }
    };
}
export default ImageViewer