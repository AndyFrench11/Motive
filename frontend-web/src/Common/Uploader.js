import React, { Component } from "react";

import 'filepond/dist/filepond.min.css';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import './filepond-override.css';

registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

const serverURL = process.env.REACT_APP_BACKEND_ADDRESS;

class Uploader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            serverConfig: null
        }
    }

    handleInit() {
        console.log("FilePond instance has initialised", this.pond);
    }


    beginProcessFile = () => {
        if (this.pond.getFile() == null || this.pond == null) {
            this.props.onFileUploaded();
        }

        this.pond.processFile().then(file => {
            console.log(file);
        });
    };

    render() {
         return (
            <FilePond
                ref={ref => (this.pond = ref)}
                acceptedFileTypes="image/png, image/jpeg, video/mp4, video/mpeg, video/webm"
                maxFileSize="100MB"
                onprocessfile={(error, file) => {
                    this.props.onFileUploaded(error, file);
                }}
                instantUpload={false}
                allowRevert={false}
                server={
                    {
                        url: serverURL + this.props.uploadUrl,
                        process: {
                            withCredentials: true
                        }
                    }
                }
                oninit={() => this.handleInit()}
            />
        );
    }
}

export default Uploader
