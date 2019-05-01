import React, { Fragment } from "react";
import { Field, reduxForm, FieldArray, formValues, formValueSelector } from "redux-form";
import {Form, Message, Modal, Input, Label, Icon, Transition, List, Image, Divider, Segment, Button, TextArea} from "semantic-ui-react";
import { connect } from "react-redux"
import {image} from './ProjectImages'

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

const renderTagInput = ({ input, meta: { touched, error, warning } }) => (
    <Form.Field>
        <div>
            <Input
                {...input}
                icon='tags'
                iconPosition='left'
                placeholder="Enter tags"
            >
            </Input>
            {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
        </div>
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

const renderMilestoneInput = ({ input, meta: { touched, error, warning } }) => (
    <Form.Field>
        <div>
        <Input
            {...input}
            placeholder='Add a new milestone...'
            required/>
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
        Please enter a value
    </Label>;

const requiredTags = value => value ? undefined :
    <Label pointing>
        Please enter a value
    </Label>;

const requiredMilestones = value => value ? undefined :
    <Label pointing>
        Please enter a value
    </Label>;




let NewProjectForm = props => {
    const {
        tagInputValue,
        milestoneInputValue
    } = props;

    const renderTaskList = ({ fields }) => (
        <Form.Field>
            <Button type="button" onClick={() => fields.push({name: milestoneInputValue})}>Add Task</Button>

            <Transition.Group as={List} duration={500} divided size='large' verticalAlign='middle'>
                {fields.map((task, index) =>
                    <List.Item key={index}>
                        <List.Content floated='right'>
                            <Button icon onClick={() => fields.remove(index)}>
                                <Icon name='delete'/>
                            </Button>

                        </List.Content>
                        <Image avatar src='https://react.semantic-ui.com/images/avatar/small/helen.jpg' />
                        <List.Content>
                            {fields.get(index).name}
                        </List.Content>
                    </List.Item>
                )}
            </Transition.Group>
        </Form.Field>
    );

    const renderTags = ({ fields }) => (
        <Form.Field>
            <Button type="button" onClick={() => fields.push({name: tagInputValue})}>Add Tag</Button>

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

    const renderPhotos = () => {
        var photoList = new Array(86);

        return (
            <Segment style={{overflow: 'auto', maxHeight: 200 }}>
                <Label attached='top' size="medium">Project Photo</Label>
                {photoList.map((index) =>
                    <Image key={index} src={projectPhotos[`image${index}`]} size='medium' rounded/>
                )}
            </Segment>
        )
    };

    return (
        <Fragment>

            <Form>
                <Segment>
                    <Label attached='top' size="medium">Project Details</Label>
                    <br/>
                    <br/>
                    <Image src={`ProjectImages/image3.png`} size='medium' rounded/>
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
                    <Field
                        component={renderTagInput}
                        name="tagInput"
                        id="tagInput"
                        validate={requiredTags}

                    />

                    <FieldArray name="tags" component={renderTags}/>

                    {renderPhotos()}



                </Segment>

                <Divider/>

                <Segment>
                    <Label attached='top' size="medium">Milestones</Label>

                    <Message floating>If you wish, you may add predefined milestones that outline the journey your project will take!</Message>

                    <Field
                        component={renderMilestoneInput}
                        name="milestoneInput"
                        id="milestoneInput"
                        type="text"
                        validate={requiredMilestones}
                    />

                    <FieldArray name="taskList" component={renderTaskList}/>

                </Segment>
            </Form>
        </Fragment>
    );
};

NewProjectForm = reduxForm({
    form: 'newProject'
})(NewProjectForm);

// Decorate with connect to read form values
const selector = formValueSelector('newProject'); // <-- same as form name
NewProjectForm = connect(state => {
    // can select values individually
    const tagInputValue = selector(state, 'tagInput');
    const milestoneInputValue = selector(state, 'milestoneInput');
    return {
        tagInputValue,
        milestoneInputValue,
    }
})(NewProjectForm);

export default NewProjectForm;

