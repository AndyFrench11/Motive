import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, Label, Menu, Input, Button, Icon, Card, Popup
} from 'semantic-ui-react'
import {connect} from "react-redux";
import uuidv4 from 'uuid/v4';
import { postTag, removeTag } from "./actions";

class ProjectTags extends React.Component {
    state = { 
        addingNewTag: false,
        tagInputValue: ""
    };

    updateTagState = () => {
        this.setState({ addingNewTag: !this.state.addingNewTag });
    };

    updateTagInputValue = (event, {value}) => {
        this.setState({ tagInputValue: value });
    }

    addNewTag = (event, {value}) => {
        const { tagInputValue } = this.state;
        const { tagList } = this.props.currentProject;
        let alreadyAdded = false;
        
        for(let i = 0; i < tagList.length; i++) {
            if(tagList[i].name === tagInputValue){
                alreadyAdded = true;
            }
        }

        if(tagInputValue !== "" && !alreadyAdded) {
            let newTag = {name: tagInputValue};
            this.props.postTag(this.props.currentProject.guid, newTag)

            this.setState({
                addingNewTag: false,
                tagInputValue: ""
            });
        }


    }

    removeTag = (event, {index}) => {
        const { tagList } = this.props.currentProject;
        const tag = tagList[index];

        //Update the backend!
        this.props.removeTag(this.props.currentProject.guid, tag);
    }

    render() {
        const { addingNewTag } = this.state;
        const { isSubProject, currentProject } = this.props;
        const { tagList } = currentProject;
        return (
            <Grid.Row style={ {marginTop: '1em'} }>
                {tagList.map((tag, index) =>
                    <Label key={index} >
                        #{tagList[index].name}
                        {!isSubProject && 
                            <Icon name='delete' index={index} onClick={this.removeTag}/>
                        }
                    </Label>
                )}
                {addingNewTag ?  
                    
                    <Input
                        placeholder='Enter tags'
                        size='mini'
                        style={{'width': '80px'}}
                        onChange={this.updateTagInputValue}
                        action
                        >
                        <input/>
                        <Button icon='add' onClick={this.addNewTag} size='mini'/>
                        <Button icon='delete' onClick={this.updateTagState} size='mini'/>

                    </Input>
                    
                    :
                    (!isSubProject && 
                        (tagList.length !== 0 ? 
                            <Popup content='Add a tag to your project' trigger={<Button circular icon='add' size='mini' onClick={this.updateTagState}/> }/>
                            :
                            <Button icon='add' size='mini' onClick={this.updateTagState}>Add a new Tag!</Button>
                        )
                    )
                }
            </Grid.Row>
        );
  }
}

function mapDispatchToProps(dispatch) {
    return {
        postTag: (projectGuid, tag) => dispatch(postTag(projectGuid, tag)),
        removeTag: (projectGuid, tag) => dispatch(removeTag(projectGuid, tag))
    };
}

const mapStateToProps = state => {
    const { projectDetailsReducer } = state;
    const { projectDetailsController } = projectDetailsReducer;
    const { isUpdating, lastUpdated, result } = projectDetailsController;
    return {
        isUpdating: isUpdating,
        result: result,
        lastUpdated: lastUpdated,
        currentProject: state.projectController.result
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTags);
