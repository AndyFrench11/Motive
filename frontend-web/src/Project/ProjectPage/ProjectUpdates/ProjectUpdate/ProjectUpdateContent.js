import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, TextArea, Form, Button, GridColumn
} from 'semantic-ui-react'
import {connect} from "react-redux";
import uuidv4 from 'uuid/v4';
import { updateProjectUpdateContent } from "./actions";

class ProjectUpdateContent extends React.Component {
    
    constructor(props) {
        super(props);
    
        this.state = { 
            projectUpdateInputValue: "",
            projectUpdateContent: this.props.content
        };
    }

    updateProjectUpdateInputValue = (event, {value}) => {
        this.setState({ projectUpdateInputValue: value });
    }

    updateProjectUpdateContent = () => {
        const { projectUpdateInputValue, projectUpdateContent } = this.state;
        
        if((projectUpdateInputValue !== "") && (projectUpdateInputValue !== projectUpdateContent)) {

            this.setState({ projectUpdateContent: projectUpdateInputValue });
            this.props.updateContentStateCallback();
            //Update the backend!
            this.props.updateProjectUpdateContent(this.props.updateGuid, projectUpdateInputValue);
            
        } else {
            this.setState({ projectUpdateInputValue: "" });
            this.props.updateContentStateCallback();
        }
    }

    cancelUpdateContent = () => {
        this.props.updateContentStateCallback()
    }

    render() {
        const { projectUpdateContent } = this.state;
        const { updatingContent } = this.props;
        return (
            <Grid.Row>
                {updatingContent ?  
                    <Form style={{'marginLeft': '1em', 'marginRight': '1em'}}>
                        <Grid>
                            <Grid.Row width={15} style={{ minHeight: 200 }}>
                                <TextArea defaultValue={projectUpdateContent} onChange={this.updateProjectUpdateInputValue} />
                            </Grid.Row>
                            <Grid.Row>
                                <Segment>
                                    <Button floated="left" icon='check' onClick={this.updateProjectUpdateContent} size='medium'/>
                                    <Button floated="right" icon='delete' onClick={this.cancelUpdateContent} size='medium'/>  
                                </Segment>
                            </Grid.Row>
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
        updateProjectUpdateContent: (updateGuid, newContent) => dispatch(updateProjectUpdateContent(updateGuid, newContent)),
    };
}

const mapStateToProps = state => {
    const { projectUpdateReducer } = state;
    const { projectUpdateController } = projectUpdateReducer;
    const { isUpdating, lastUpdated, result } = projectUpdateController;
    return {
        isUpdating: isUpdating,
        result: result,
        lastUpdated: lastUpdated,
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(ProjectUpdateContent);

