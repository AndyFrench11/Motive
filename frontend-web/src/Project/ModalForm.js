import React, { Fragment } from "react";
import { Field, reduxForm, FieldArray, formValues, formValueSelector } from "redux-form";
import {Form, Message, Modal, Input, Label, Icon, Header, List, Image, Divider, Segment, Button, TextArea} from "semantic-ui-react";
import { connect } from "react-redux"

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

            <List animated divided verticalAlign='middle' size='large'>
                {fields.map((task, index) =>
                    <List.Item key={index}>
                        <List.Content floated='right'>
                            <Button icon onClick={() => fields.remove(index)}>
                                <Icon name='delete'/>
                            </Button>

                        </List.Content>
                        <Image avatar src='https://reac.semantic-ui.com/images/avatar/small/helen.jpg' />
                        <List.Content>
                            {fields.get(index).name}
                        </List.Content>
                    </List.Item>
                )}

            </List>
        </Form.Field>
    );

    const renderTags = ({ fields }) => (
        <Form.Field>
            <Button type="button" onClick={() => fields.push({name: tagInputValue})}>Add Tag</Button>

            {fields.map((task, index) =>
                <Label key={index} >
                    {fields.get(index).name}
                    <Icon name='delete' onClick={() => fields.remove(index)}/>
                </Label>
            )}

        </Form.Field>
    );

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
                    <Field
                        component={renderTagInput}
                        name="tagInput"
                        id="tagInput"
                        validate={requiredTags}

                    />

                    <FieldArray name="tags" component={renderTags}/>
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

