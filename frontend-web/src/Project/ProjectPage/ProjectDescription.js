import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, TextArea, Form, Button, GridColumn
} from 'semantic-ui-react'
import {connect} from "react-redux";
import uuidv4 from 'uuid/v4';

class ProjectDescription extends React.Component {
    state = { 
        updatingProjectDescription: false,
        projectDescriptionInputValue: "",
        projectDescription: this.props.projectDescription
    };

    updateProjectDescriptionState = () => {
        this.setState({ updatingProjectDescription: !this.state.updatingProjectDescription });
    };

    updateProjectDescriptionInputValue = (event, {value}) => {
        this.setState({ projectDescriptionInputValue: value });
    }

    updateProjectDescription = () => {
        const { projectDescriptionInputValue, projectDescription } = this.state;
        if((projectDescriptionInputValue !== "") && (projectDescriptionInputValue !== projectDescription)) {
            this.setState({
                updatingProjectDescription: false,
                projectDescriptionInputValue: "",
                projectDescription: projectDescriptionInputValue
            });
            //Update the backend!
            
            
        } else {
            this.setState({
                updatingProjectDescription: false,
                projectDescriptionInputValue: "",
            });
        }

    }

    render() {
        const { projectDescription, updatingProjectDescription } = this.state;
        return (
            <Grid.Row>
                {updatingProjectDescription ?  
                    <Form>
                        <Grid>
                            <Grid.Column width={10}>
                                <TextArea defaultValue={projectDescription} onChange={this.updateProjectDescriptionInputValue} />
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <Grid.Row>
                                    <Button icon='check' onClick={this.updateProjectDescription} size='medium'/>
                                </Grid.Row>
                                <Grid.Row>
                                    <Button icon='delete' onClick={this.updateProjectDescriptionState} size='medium'/>  
                                </Grid.Row>
                                
                            </Grid.Column>
                        </Grid>
                    </Form>
                    : 
                    <Segment compact onClick={this.updateProjectDescriptionState}>{projectDescription}</Segment> 
                }
            </Grid.Row>
        );
  }
}

const mapStateToProps = state => {
    return {};
};

export default connect(mapStateToProps)(ProjectDescription);
