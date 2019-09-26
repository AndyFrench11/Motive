import React, { Fragment, Component } from "react";
import { Field, reduxForm, FieldArray, formValues, formValueSelector } from "redux-form";
import {Form, Message, Modal, Input, Label, Icon, Transition, List, Image, Divider, Segment, Button, TextArea} from "semantic-ui-react";
import { connect } from "react-redux"


function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

const images = importAll(require.context('.././ProjectImages', false, /\.(png|jpe?g|svg)$/));

const renderTextArea = ({ input, label, placeholder, meta: { touched, error, warning } }) => (
    <Form.Field>
        <TextArea
            {...input}
            label={label}
            placeholder={placeholder}
        />
        {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
    </Form.Field>

);

const renderNameInput = ({ input, label, placeholder, meta: { touched, error, warning } }) => (
    <Form.Field>
        <div>
            <Input
                {...input}
                label={label}
                placeholder={placeholder}
            />
            {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
        </div>

    </Form.Field>
);

const requiredDescription = value => value ? undefined :
    <Label pointing>
        Please enter a description
    </Label>;


const requiredName = value => value ? undefined :
    <Label pointing>
        Please enter a name
    </Label>;

const requiredTags = value => value ? undefined :
    <Label pointing>
        Please enter a tag
    </Label>;

const requiredTasks = value => value ? undefined :
    <Label pointing>
        Please enter a task
    </Label>;


class NewProjectForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedImageIndex: this.props.selectedImageIndex,
            tagInputValue: "",
            taskInputValue: ""
        }

    }

    renderTaskList = ({ fields }) => (
        <Form.Field>
            <Button type="button" onClick={() => {
                const { taskInputValue } = this.state;

                let alreadyAdded = false;
                
                for(let i = 0; i < fields.length; i++) {
                    if(fields.get(i).name === taskInputValue){
                        alreadyAdded = true;
                    }
                }

                if(taskInputValue !== "" && !alreadyAdded) {
                    fields.push({name: this.state.taskInputValue, completed: false, orderIndex: -1})
                    this.setState({taskInputValue: ""})
                }
                
            }}>
                Add Task</Button>

            <Transition.Group as={List} duration={500} divided size='large' verticalAlign='middle'>
                {fields.map((task, index) =>
                    <List.Item key={index}>
                        <List.Content floated='right'>
                            <Button icon onClick={() => fields.remove(index)}>
                                <Icon name='delete'/>
                            </Button>

                        </List.Content>
                        <Icon name="tasks" size="small"/>
                        <List.Content>
                            {fields.get(index).name}
                        </List.Content>
                    </List.Item>
                )}
            </Transition.Group>
        </Form.Field>
    );

    renderTags = ({ fields }) => (
        <Form.Field>
            <Button type="button" onClick={() => {

                const { tagInputValue } = this.state;

                let alreadyAdded = false;
                
                for(let i = 0; i < fields.length; i++) {
                    if(fields.get(i).name === tagInputValue){
                        alreadyAdded = true;
                    }
                }

                if(tagInputValue !== "" && !alreadyAdded) {
                    fields.push({name: tagInputValue})
                    this.setState({tagInputValue: ""})
                }
            }}>
                Add Tag</Button>

            <Transition.Group as={List} duration={500} divided size='large' verticalAlign='middle' horizontal>
            {fields.map((task, index) =>

                    <Label key={index} >
                        #{fields.get(index).name}
                        <Icon name='delete' onClick={() => fields.remove(index)}/>
                    </Label>

            )}
            </Transition.Group>

        </Form.Field>
    );

    setSelectedImage = (event, {index}) => {
        this.setState({
            selectedImageIndex: index
        });
        this.props.updateSelectedImageIndex(index)

    };

    renderPhotos = () => {
        var photoList = Object.keys(images);

        return (
            <Segment style={{overflow: 'auto', maxHeight: 200 }}>
                <Label attached='top' size="medium">Project Photo</Label>
                <Image.Group size='tiny'>
                    {photoList.map((photo, index) =>
                        <Button basic toggle active={index == this.state.selectedImageIndex} index={index} onClick={this.setSelectedImage}>
                            <Image src={images[photoList[index]]} fluid/>
                        </Button>
                    )}
                </Image.Group>
            </Segment>
        )
    };


    updateTagInputValue = (event, {value}) => {
        this.setState({ tagInputValue: value });
    }

    updateTaskInputValue = (event, {value}) => {
        this.setState({ taskInputValue: value });
    }
    
    render() {

        const { isSubProject, tags } = this.props;

        return (
            <Fragment>
                <Form>
                    <Segment>
                        <Label attached='top' size="medium">Project Details</Label>
                        <br/>
                        <br/>
                        <Field
                            component={renderNameInput}
                            label="Project name"
                            name="projectNameInput"
                            placeholder="e.g. Rewiring the Mainframe!"
                            validate={requiredName}
                        />
                        <Field
                            component={renderTextArea}
                            name="descriptionInput"
                            placeholder="Tell us more about the project..."
                            validate={requiredDescription}
                        />

                        <Message floating>You are limited to 500 characters.</Message>

                        {!isSubProject && 

                            <Input
                                value={this.state.tagInputValue}
                                icon='tags'
                                iconPosition='left'
                                placeholder="Enter tags"
                                onChange={this.updateTagInputValue}
                            >
                            </Input>

                        }

                        <Divider/>
                        
                        {isSubProject ? 

                            <Segment>
                                <Label attached='top left'>Tags</Label>
                                {tags.map((tag, index) =>
                                    <Label>
                                        #{tag.name}
                                    </Label>
                
                                )}
                            </Segment>
                            :
                            <FieldArray name="tags" component={this.renderTags}/>
                        }

                        {this.renderPhotos()}

                    </Segment>

                    <Divider/>

                    <Segment>
                        <Label attached='top' size="medium">Tasks</Label>

                        <Message floating>If you wish, you may add predefined tasks that outline the journey your project will take!</Message>

                        <Input
                            value={this.state.taskInputValue}
                            icon='tasks'
                            iconPosition='left'
                            placeholder="Add a new task..."
                            onChange={this.updateTaskInputValue}
                        />

                        <Divider/>

                        <FieldArray name="taskList" component={this.renderTaskList}/>

                    </Segment>
                </Form>
            </Fragment>
        );
    }
};

NewProjectForm = reduxForm({
    form: 'newProject'
})(NewProjectForm);

// Decorate with connect to read form values
const selector = formValueSelector('newProject'); // <-- same as form name

export default NewProjectForm;

