import React, { Fragment } from "react";
import { Field, reduxForm } from "redux-form";
import {Form, Message, Modal, Input, Label, Icon, Header, List, Image, Divider, Segment, Button} from "semantic-ui-react";

const renderCheckbox = field => (
    <Form.Checkbox
        checked={!!field.input.value}
        name={field.input.name}
        label={field.label}
        onChange={(e, { checked }) => field.input.onChange(checked)}
    />
);

const renderRadio = field => (
    <Form.Radio
        checked={field.input.value === field.radioValue}
        label={field.label}
        name={field.input.name}
        onChange={(e, { checked }) => field.input.onChange(field.radioValue)}
    />
);

const renderSelect = field => (
    <Form.Select
        label={field.label}
        name={field.input.name}
        onChange={(e, { value }) => field.input.onChange(value)}
        options={field.options}
        placeholder={field.placeholder}
        value={field.input.value}
    />
);

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
        <Input action={{ icon: 'add', onClick: addNewItemToList(field)}}
               placeholder={field.placeholder} />
    </Form.Field>
)

const addNewItemToList = field => {
    console.log("gday mate!");
    console.log("--------------------------------------------");
    console.log(field);
    console.log("--------------------------------------------");
};

const ProfileForm = props => {
    const { handleSubmit } = props;

    return (
        <Fragment>

            {/*<Form onSubmit={this.handleModalSubmit}>*/}
            {/*    <Field />*/}
            {/*    <Field>*/}
            {/*        <label>Last Name</label>*/}
            {/*        <input placeholder='Last Name' />*/}
            {/*    </Field>*/}
            {/*    <Field>*/}
            {/*        <Checkbox label='I agree to the Terms and Conditions' />*/}
            {/*    </Field>*/}
            {/*    <Button type='submit'>Submit</Button>*/}
            {/*</Form>*/}

            {/*<Input label='Name' placeholder='My Awesome New Project!' />*/}
            {/*<br/>*/}
            {/*<Input label='Description' placeholder='My Awesome New Project!' />*/}
            {/*<br/>*/}



            {/*<Image wrapped size='small' src={BookImage} />*/}

            <Form onSubmit={handleSubmit}>
                <Segment padded>
                    <Label attached='top' size="medium">Project Details</Label>
                    {/*<Header as='h3'>Project Details</Header>*/}
                    <Field
                        component={renderNameInput}
                        label="Project name"
                        name="projectName"
                        placeholder="e.g. Rewiring the Mainframe!"
                    />
                    <Field
                        component={renderTextArea}
                        name="description"
                        placeholder="Tell us more about the project..."
                    />
                    <Field
                        component={renderTagInput}
                        name="tags"
                    />
                    <Label>
                        Rewiring
                        <Icon name='delete' />
                    </Label>
                    <br/>
                </Segment>

                <Divider/>

                <Segment>
                    <Label attached='top' size="medium">Milestones</Label>

                    <Message floating>If you wish, you may add predefined milestones that outline the journey your project will take!</Message>

                    <Field
                        component={renderMilestoneInput}
                        name="milestoneInput"
                        placeholder='Add a new milestone...'
                    />

                    <List animated divided verticalAlign='middle' size='large'>
                        {/*<List.Item>*/}
                        {/*    <Image avatar src='https://react.semantic-ui.com/images/avatar/small/helen.jpg' />*/}
                        {/*    <List.Content>*/}
                        {/*        <List.Header>Helen</List.Header>*/}
                        {/*    </List.Content>*/}
                        {/*</List.Item>*/}
                        {/*<List.Item>*/}
                        {/*    <Image avatar src='https://react.semantic-ui.com/images/avatar/small/christian.jpg' />*/}
                        {/*    <List.Content>*/}
                        {/*        <List.Header>Christian</List.Header>*/}
                        {/*    </List.Content>*/}
                        {/*</List.Item>*/}
                        {/*<List.Item>*/}
                        {/*    <Image avatar src='https://react.semantic-ui.com/images/avatar/small/daniel.jpg' />*/}
                        {/*    <List.Content>*/}
                        {/*        <List.Header>Daniel</List.Header>*/}
                        {/*    </List.Content>*/}
                        {/*</List.Item>*/}
                    </List>
                </Segment>

                {/*    <Field*/}
                {/*        component={renderSelect}*/}
                {/*        label="Gender"*/}
                {/*        name="gender"*/}
                {/*        options={[*/}
                {/*            { key: "m", text: "Male", value: "male" },*/}
                {/*            { key: "f", text: "Female", value: "female" }*/}
                {/*        ]}*/}
                {/*        placeholder="Gender"*/}
                {/*    />*/}

                {/*<Form.Group inline>*/}
                {/*    <label>Quantity</label>*/}

                {/*    <Field*/}
                {/*        component={renderRadio}*/}
                {/*        label="One"*/}
                {/*        name="quantity"*/}
                {/*        radioValue={1}*/}
                {/*    />*/}
                {/*    <Field*/}
                {/*        component={renderRadio}*/}
                {/*        label="Two"*/}
                {/*        name="quantity"*/}
                {/*        radioValue={2}*/}
                {/*    />*/}
                {/*    <Field*/}
                {/*        component={renderRadio}*/}
                {/*        label="Three"*/}
                {/*        name="quantity"*/}
                {/*        radioValue={3}*/}
                {/*    />*/}
                {/*</Form.Group>*/}

                {/*<Field*/}
                {/*    component={renderTextArea}*/}
                {/*    label="About"*/}
                {/*    name="about"*/}
                {/*    placeholder="Tell us more about you..."*/}
                {/*/>*/}

                {/*<Field*/}
                {/*    component={renderCheckbox}*/}
                {/*    label="I agree to the Terms and Conditions"*/}
                {/*    name="isAgreed"*/}
                {/*/>*/}

                {/*<Form.Group inline>*/}
                {/*    <Form.Button primary>Submit</Form.Button>*/}
                {/*</Form.Group>*/}
            </Form>
        </Fragment>
    );
};

export default reduxForm({
    form: "createProject"
})(ProfileForm);


