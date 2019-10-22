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
            projectUpdateInputValue: ""
        };
    }

    updateProjectUpdateInputValue = (event, {value}) => {
        this.setState({ projectUpdateInputValue: value });
    }

    updateProjectUpdateContent = () => {
        const { projectUpdateInputValue } = this.state;
        const { content } = this.props;
        
        if((projectUpdateInputValue !== "") && (projectUpdateInputValue !== content)) {

            //Update the backend!
            this.props.updateProjectUpdateContent(this.props.updateGuid, projectUpdateInputValue, this.props.relatedProjectGuid);
            this.props.updateContentStateCallback();
            
        } else {
            this.setState({ projectUpdateInputValue: "" });
            this.props.updateContentStateCallback();
        }
    }

    cancelUpdateContent = () => {
        this.props.updateContentStateCallback()
    }

    render() {
        const { updatingContent, content } = this.props;
        return (
            <Grid.Row>
                {updatingContent ?  
                    <Form style={{'marginLeft': '1em', 'marginRight': '1em'}}>
                        <Grid>
                            <Grid.Row width={15} style={{ minHeight: 200 }}>
                                <TextArea defaultValue={content} onChange={this.updateProjectUpdateInputValue} />
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
                    <Segment>{content}</Segment> 
                }
            </Grid.Row>
        );
  }
}

function mapDispatchToProps(dispatch) {
    return {
        updateProjectUpdateContent: (updateGuid, newContent, projectGuid) => dispatch(updateProjectUpdateContent(updateGuid, newContent, projectGuid)),
    };
}

const mapStateToProps = state => {
    const { projectUpdateReducer } = state;
    const { projectUpdateController } = projectUpdateReducer;
    const { isUpdating, lastUpdated, result } = projectUpdateController;
    return {
        isUpdating: isUpdating,
        result: result,
        lastUpdated: lastUpdated
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(ProjectUpdateContent);

