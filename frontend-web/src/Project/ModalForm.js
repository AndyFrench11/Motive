import React, { Fragment } from "react";
import { Field, reduxForm, FieldArray, formValues, formValueSelector } from "redux-form";
import {Form, Message, Modal, Input, Label, Icon, Transition, List, Image, Divider, Segment, Button, TextArea} from "semantic-ui-react";
import { connect } from "react-redux"
import {
    DateInput,
    TimeInput,
    DateTimeInput,
    DatesRangeInput
} from 'semantic-ui-calendar-react';


function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

const images = importAll(require.context('./ProjectImages', false, /\.(png|jpe?g|svg)$/));

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

const renderTaskInput = ({ input, meta: { touched, error, warning } }) => (
    <Form.Field>
        <div>
        <Input
            {...input}
            placeholder='Add a new task...'
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

const requiredStartDate = value => value ? undefined :
    <Label pointing>
        Please enter a start date
    </Label>;



let NewProjectForm = props => {
    const {
        tagInputValue,
        taskInputValue
    } = props;

    const renderTaskList = ({ fields }) => (
        <Form.Field>
            <Button type="button" onClick={() => fields.push({name: taskInputValue})}>Add Task</Button>

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

    const renderStartDateInput = ({ input, placeholder, label, meta: { touched, error, warning } }) => {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth()+1; //As January is 0.
        let yyyy = today.getFullYear();

        if(dd<10) dd='0'+dd;
        if(mm<10) mm='0'+mm;

        return (
            <Form.Field>
                <div>
                    <Input
                        {...input}
                        label={label}
                        placeholder={dd+"/"+mm+"/"+yyyy}
                    />

                    {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
                </div>
            </Form.Field>
        );
    };


    const renderPhotos = () => {
        var photoList = Object.keys(images);

        return (
            <Segment style={{overflow: 'auto', maxHeight: 200 }}>
                <Label attached='top' size="medium">Project Photo</Label>
                <Image.Group size='tiny'>
                    {photoList.map((photo, index) =>
                        <Button basic toggle active={false} index={index}>
                            <Image src={images[photoList[index]]} fluid
                                   />
                        </Button>

                    )}

                </Image.Group>
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
                        component={renderStartDateInput}
                        name="startDateInput"
                        id="startDateInput"
                        label="Start Date"
                        validate={requiredStartDate}
                    />

                    {/*<Field*/}
                    {/*    component={renderEndDateInput}*/}
                    {/*    name="endDateInput"*/}
                    {/*    id="endDateInput"*/}
                    {/*    label="End Date and Time"*/}
                    {/*/>*/}


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
                    <Label attached='top' size="medium">Tasks</Label>

                    <Message floating>If you wish, you may add predefined tasks that outline the journey your project will take!</Message>

                    <Field
                        component={renderTaskInput}
                        name="taskInput"
                        id="taskInput"
                        type="text"
                        validate={requiredTasks}
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
    const taskInputValue = selector(state, 'taskInput');
    return {
        tagInputValue,
        taskInputValue,
    }
})(NewProjectForm);

export default NewProjectForm;

