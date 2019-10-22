import React from 'react'
import {
    Button, Segment, Header, Item, TransitionablePortal, Modal, Icon, Grid
} from 'semantic-ui-react'
import {connect} from "react-redux";
import { Route } from 'react-router-dom';
import NewProjectForm from "../Project/CreateNewProject/ModalForm";
import uuidv4 from 'uuid/v4';
import { postProject } from '../Project/actions';
import { fetchProjects } from "./actions";
import LoaderInlineCentered from "../Common/Loader";

function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

const images = importAll(require.context('../Project/ProjectImages', false, /\.(png|jpe?g|svg)$/));

class UserProjectList extends React.Component {

    constructor(props) {
        super(props);

        this.state = { 
            modalVisible: false,
            submitButtonDisabled: true,
            selectedImageIndex: -1
        };

    }

    componentDidMount() {
        const { userguid } = this.props.userGuid;
        this.props.fetchProjects(userguid);
    }

    componentDidUpdate(oldProps) {
        const newProps = this.props;
        if(oldProps.newProjectValues !== newProps.newProjectValues) {
            const values = newProps.newProjectValues;
            if((typeof values !== 'undefined') && ((values.hasOwnProperty('projectNameInput')) && (values.hasOwnProperty('descriptionInput'))
                && (values.hasOwnProperty('tags')) && (values.tags.length > 0) && (values.hasOwnProperty('taskList')) && (values.taskList.length > 0) 
                && (this.state.selectedImageIndex !== -1)  )) {

                this.setState({submitButtonDisabled: false})
            } else {

                this.setState({submitButtonDisabled: true})
            }
        }
    }

    showModal = () => {
        this.setState({modalVisible: true});
    };

    closeModal = () => {
        this.setState({modalVisible: false});
    };

    updateSelectedImageIndex = (selectedImageIndex) => {
        this.setState({selectedImageIndex: selectedImageIndex})
    }

    handleModalSubmit = () => {
        //Add the new project to the local state
        const { selectedImageIndex } = this.state;
        const { newProjectValues, userGuid } = this.props;

        const newProject = {
            name: newProjectValues.projectNameInput,
            description: newProjectValues.descriptionInput,
            taskList: newProjectValues.taskList,
            tagList: newProjectValues.tags,
            imageIndex: selectedImageIndex,
            guid: uuidv4()
        };

        this.props.postProject(userGuid, newProject);


        this.setState({
            modalVisible: false, 
            submitButtonDisabled: true,
            selectedImageIndex: -1
        });

    };

    render() {

        if (this.props.projects === undefined || this.props.projects === null ) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            )
        } else {

            var photoList = Object.keys(images);

            const { projects } = this.props;

            if(projects.length == 0){
                return(
                    <Segment placeholder style={{marginLeft: '5em', marginRight: '5em'}}>
                        <Header icon>
                            <Icon name='idea outline' />
                            No projects have been created.
                        </Header>
                        <Button onClick={this.showModal}>Create Project</Button>
                        <TransitionablePortal open={this.state.modalVisible}
                                            transition={{animation: 'fade up', duration: 500}}>
                            <Modal open={true} onClose={this.closeModal} closeIcon>
                                <Modal.Header>Create a New Project</Modal.Header>
                                <Modal.Content>
                                    <NewProjectForm updateSelectedImageIndex={this.updateSelectedImageIndex} isSubProject={false} />
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button
                                        positive
                                        icon='checkmark'
                                        labelPosition='right'
                                        content="All good to go!"
                                        onClick={this.handleModalSubmit}
                                        disabled={this.state.submitButtonDisabled}
                                    />
                                </Modal.Actions>
                            </Modal>
                        </TransitionablePortal>
                    </Segment>
                );
            } else {
                var photoList = Object.keys(images);

                return (
                    <Segment style={{ marginLeft: '5em', marginRight: '5em'}}>
                        <Item.Group link divided>
                            {projects.map((project, index) => {
                                return (
                                    <Route render={({ history }) => (
                                        <Item key={index} onClick={() => { history.push(`/project/${project.guid}/`) }}>
                                            <Item.Image size='tiny' src={images[photoList[project.imageIndex]]} />
                                            <Item.Content>
                                                <Item.Header>{project.name}</Item.Header>
                                                <Item.Description>{project.description}</Item.Description>
                                            </Item.Content>
                                        </Item>
                                    )} />
                            )})}
                        </Item.Group>
                        <Button onClick={this.showModal}>Create Project</Button>
                        <TransitionablePortal open={this.state.modalVisible}
                                            transition={{animation: 'fade up', duration: 500}}>
                            <Modal open={true} onClose={this.closeModal} closeIcon>
                                <Modal.Header>Create a New Project</Modal.Header>
                                <Modal.Content>
                                    <NewProjectForm updateSelectedImageIndex={this.updateSelectedImageIndex} isSubProject={false}/>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Button
                                        positive
                                        icon='checkmark'
                                        labelPosition='right'
                                        content="All good to go!"
                                        onClick={this.handleModalSubmit}
                                        disabled={this.state.submitButtonDisabled}
                                    />
                                </Modal.Actions>
                            </Modal>
                        </TransitionablePortal>
                    </Segment>
                )
            }
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchProjects: (guid) => dispatch(fetchProjects(guid)),
        postProject: (guid, values, imageIndex) => dispatch(postProject(guid, values, imageIndex))
    };
}

const mapStateToProps = state => {
    const { createProjectController, form } = state;
    const { isPosting, lastUpdated, result } = createProjectController;
    const { newProject } = form;
    return {
        newProjectValues: newProject && newProject.values,
        projectCreationSubmitSucceeded: newProject && newProject.submitSucceeded, 
        isPosting: isPosting,
        result: result,
        lastUpdated: lastUpdated,
        projects: state.profilePage.projects.items
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProjectList);
