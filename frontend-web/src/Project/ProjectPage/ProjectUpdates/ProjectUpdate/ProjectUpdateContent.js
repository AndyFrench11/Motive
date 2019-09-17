import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, TextArea, Form, Button, GridColumn
} from 'semantic-ui-react'
import {connect} from "react-redux";
import uuidv4 from 'uuid/v4';
import { updateProjectDescription } from "./actions";

class ProjectUpdateContent extends React.Component {
    
    constructor(props) {
        super(props);
    
        this.state = { 
            updatingProjectUpdateContent: this.props.updating,
            projectUpdateInputValue: "",
            projectUpdateContent: this.props.content
        };
    }

    updateProjectUpdateContentState = () => {
        this.setState({ updatingProjectUpdateContent: !this.state.updatingProjectUpdateContent });
    };

    updateProjectUpdateInputValue = (event, {value}) => {
        this.setState({ projectUpdateInputValue: value });
    }

    updateProjectUpdateContent = () => {
        console.log("Hello");
        // const { projectDescriptionInputValue, projectDescription } = this.state;
        // if((projectDescriptionInputValue !== "") && (projectDescriptionInputValue !== projectDescription)) {
        //     this.setState({
        //         updatingProjectDescription: false,
        //         projectDescriptionInputValue: "",
        //         projectDescription: projectDescriptionInputValue
        //     });
        //     //Update the backend!
        //     this.props.updateProjectDescription(this.props.projectGuid, projectDescriptionInputValue);
            
            
        // } else {
        //     this.setState({
        //         updatingProjectDescription: false,
        //         projectDescriptionInputValue: "",
        //     });
        // }
    }

    render() {
        const { projectUpdateContent, updatingProjectUpdateContent } = this.state;

        return (
            <Grid.Row>
                {updatingProjectUpdateContent ?  
                    <Form>
                        <Grid>
                            <Grid.Column width={15}>
                                <TextArea defaultValue={projectUpdateContent} onChange={this.updateProjectUpdateInputValue} />
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Grid.Row>
                                    <Button icon='check' onClick={this.updateProjectUpdateContent} size='medium'/>
                                </Grid.Row>
                                <Grid.Row>
                                    <Button icon='delete' onClick={this.updateProjectUpdateContentState} size='medium'/>  
                                </Grid.Row>
                                
                            </Grid.Column>
                        </Grid>
                    </Form>
                    : 
                    <Segment>{projectUpdateContent}</Segment> 
                }
            </Grid.Row>
        );
  }
}

function mapDispatchToProps(dispatch) {
    return {
        //updateProjectDescription: (projectGuid, projectDescription) => dispatch(updateProjectDescription(projectGuid, projectDescription)),
    };
}

const mapStateToProps = state => {
    // const { projectDetailsReducer } = state;
    // const { projectDetailsController } = projectDetailsReducer;
    // const { isUpdating, lastUpdated, result } = projectDetailsController;
    // return {
    //     isUpdating: isUpdating,
    //     result: result,
    //     lastUpdated: lastUpdated,
    // };
};


export default connect(mapStateToProps, mapDispatchToProps)(ProjectUpdateContent);
