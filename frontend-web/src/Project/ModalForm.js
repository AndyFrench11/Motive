import React, { Fragment } from "react";
import { Field, reduxForm, FieldArray, formValues, formValueSelector } from "redux-form";
import {Form, Message, Modal, Input, Label, Icon, Header, List, Image, Divider, Segment, Button} from "semantic-ui-react";
import { connect } from "react-redux"

const renderTextArea = field => (
    <Form.TextArea
        {...field.input}
        label={field.label}
        placeholder={field.placeholder}
    />
);

const renderTagInput = field => (
    <Form.Field>
        <Input
            {...field.input}
            icon='tags'
            iconPosition='left'
            label={{ tag: true, content: 'Add Tag' }}
            labelPosition='right'
            placeholder="Enter tags"
        >
        </Input>
    </Form.Field>

);

const renderNameInput = field => (
    <Form.Field>
        <Input
            {...field.input}
            label={field.label}
            placeholder={field.placeholder}
        />
    </Form.Field>
);

const renderMilestoneInput = field => (
    <Form.Field>
        <Input
            {...field.input}
            placeholder='Add a new milestone...' />
    </Form.Field>
);


let NewProjectForm = props => {
    const {
        tagInputValue,
        milestoneInputValue,
    } = props;

    const renderTaskList = ({ fields }) => (
        <Form.Field>
            <Button type="button" onClick={() => fields.push({taskName: milestoneInputValue})}>Add Task</Button>

            <List animated divided verticalAlign='middle' size='large'>
                {fields.map((task, index) =>
                    <List.Item key={index}>
                        <List.Content floated='right'>
                            <Button icon onClick={() => fields.remove(index)}>
                                <Icon name='delete'/>
                            </Button>

                        </List.Content>
                        <Image avatar src='https://react.semantic-ui.com/images/avatar/small/helen.jpg' />
                        <List.Content>
                            {fields.get(index).taskName}
                        </List.Content>
                    </List.Item>
                )}

            </List>
        </Form.Field>
    );

    const renderTags = ({ fields }) => (
        <Form.Field>
            <Button type="button" onClick={() => fields.push({tagName: tagInputValue})}>Add Tag</Button>

            {fields.map((task, index) =>
                <Label key={index} >
                    {fields.get(index).tagName}
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
                    />
                    <Field
                        component={renderTextArea}
                        name="descriptionInput"
                        placeholder="Tell us more about the project..."
                    />
                    <Field
                        component={renderTagInput}
                        name="tagInput"
                        id="tagInput"

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

{/*<li key={index}>*/}
{/*<button*/}
{/*    type="button"*/}
{/*    title="Remove Member"*/}
{/*    onClick={() => fields.remove(index)}/>*/}
{/*<h4>Member #{index + 1}</h4>*/}
{/*<Field*/}
{/*    name={`${task}.firstName`}*/}
{/*    type="text"*/}
{/*    component={renderField}*/}
{/*    label="First Name"/>*/}
{/*<Field*/}
{/*    name={`${member}.lastName`}*/}
{/*    type="text"*/}
{/*    component={renderField}*/}
{/*    label="Last Name"/>*/}
{/*<FieldArray name={`${member}.hobbies`} component={renderHobbies}/>*/}
{/*</li>*/}
//
// const renderCheckbox = field => (
//     <Form.Checkbox
//         checked={!!field.input.value}
//         name={field.input.name}
//         label={field.label}
//         onChange={(e, { checked }) => field.input.onChange(checked)}
//     />
// );
//
// const renderRadio = field => (
//     <Form.Radio
//         checked={field.input.value === field.radioValue}
//         label={field.label}
//         name={field.input.name}
//         onChange={(e, { checked }) => field.input.onChange(field.radioValue)}
//     />
// );
//
// const renderSelect = field => (
//     <Form.Select
//         label={field.label}
//         name={field.input.name}
//         onChange={(e, { value }) => field.input.onChange(value)}
//         options={field.options}
//         placeholder={field.placeholder}
//         value={field.input.value}
//     />
// );
