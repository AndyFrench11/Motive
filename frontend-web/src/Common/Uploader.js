import React, { Component } from "react";
import ReactDOM from "react-dom";
import {
    Button,
    Segment,
    Divider,
    Tab,
    Table,
    Message,
    Checkbox,
    Form,
    Icon,
    Input,
    Dropdown,
    Dimmer,
    Loader,
    Label,
    LabelDetail
} from "semantic-ui-react";

import axios, { post } from "axios";
import TopNavBar from "./TopNavBar";

const serverURL = process.env.REACT_APP_BACKEND_ADDRESS;


class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null
        };
    }

    fileInputRef = React.createRef();

    onFormSubmit = e => {
        e.preventDefault(); // Stop form submit
        this.fileUpload(this.state.file).then(response => {
            console.log(response.data);
        });
    };

    fileChange = e => {
        this.setState({ file: e.target.files[0] }, () => {
            console.log("File chosen --->", this.state.file);
        });
    };

    // Import datasources/schemas Tab 1
    fileUpload = file => {
        const url = serverURL + "/upload";
        const formData = new FormData();
        formData.append("file", file);
        const config = {
            withCredentials: true,
            headers: {
                "Content-type": "multipart/form-data"
            }
        };
        return post(url, formData, config);
    };

    // Export Schedules Tab 2
    fileExport = file => {
        // handle save for export button function
    };

    render() {
        const { file } = this.state;
        const panes = [
            {
                menuItem: "Import ",
                render: () => (
                    <Tab.Pane attached={false}>
                        <Message>Some message about offline usage</Message>
                        <Form onSubmit={this.onFormSubmit}>
                            <Form.Field>
                                <Button
                                    content="Choose File"
                                    labelPosition="left"
                                    icon="file"
                                    onClick={() => this.fileInputRef.current.click()}
                                />
                                <input
                                    ref={this.fileInputRef}
                                    type="file"
                                    hidden
                                    onChange={this.fileChange}
                                />
                            </Form.Field>
                            <Button type="submit">Upload</Button>
                        </Form>
                    </Tab.Pane>
                )
            }
        ];
        return (
            <Segment style={{ padding: "5em 1em" }} vertical>
                <TopNavBar/>
                <Divider horizontal>OFFLINE USAGE</Divider>
                <Tab menu={{ pointing: true }} panes={panes} />
            </Segment>
        );
    }
}

export default Uploader