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
        tagInputValue: "",
        tagList: this.props.tagList
    };

    updateTagState = () => {
        this.setState({ addingNewTag: !this.state.addingNewTag });
    };

    updateTagInputValue = (event, {value}) => {
        this.setState({ tagInputValue: value });
    }

    addNewTag = (event, {value}) => {
        console.log(this.state.tagInputValue)
        const { tagList, tagInputValue } = this.state;
        let newTag = {name: tagInputValue};
        tagList.push(newTag);

        this.setState({
            addingNewTag: false,
            tagInputValue: "",
            tagList: tagList
        });

        //Update the backend!
        this.props.postTag(this.props.projectGuid, newTag)

    }

    removeTag = (event, {index}) => {
        const { tagList } = this.state;
        const tag = tagList[index];
        tagList.splice(index, 1);
        this.setState({ tagList: tagList })

        //Update the backend!
        this.props.removeTag(this.props.projectGuid, tag);
    }

    render() {
        const { tagList, addingNewTag } = this.state;
        return (
            <Grid.Row style={ {marginTop: '1em'} }>
                {tagList.map((tag, index) =>
                    <Label key={index} >
                        #{tagList[index].name}
                        <Icon name='delete' index={index} onClick={this.removeTag}/>
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
                    (tagList.length !== 0 ? 
                        <Popup content='Add a tag to your project' trigger={<Button circular icon='add' size='mini' onClick={this.updateTagState}/> }/>
                        :
                        <Button icon='add' size='mini' onClick={this.updateTagState}>Add a new Tag!</Button>
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTags);
