import React from 'react'
import {
    Button, Segment, Header, Item, TransitionablePortal, Modal
} from 'semantic-ui-react'
import {connect} from "react-redux";
import { Route } from 'react-router-dom';
import NewProjectForm from "../../CreateNewProject/ModalForm";
import uuidv4 from 'uuid/v4';

function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

const images = importAll(require.context('../.././ProjectImages', false, /\.(png|jpe?g|svg)$/));

class SubProjectList extends React.Component {

    constructor(props) {
        super(props);

        this.state = { 
            subProjects: this.props.subProjects,
            modalVisible: false,
            submitButtonDisabled: true,
            selectedImageIndex: -1
        };

    }

    componentDidUpdate(oldProps) {
        const newProps = this.props;
        if(oldProps.newProjectValues !== newProps.newProjectValues) {
            const values = newProps.newProjectValues;
            if((typeof values !== 'undefined') && ((values.hasOwnProperty('projectNameInput')) && (values.hasOwnProperty('descriptionInput'))
                && (values.hasOwnProperty('taskList')) && (values.taskList.length > 0) 
                && (this.state.selectedImageIndex !== -1)  )) {

                this.setState({submitButtonDisabled: false})
            } else {
                this.setState({submitButtonDisabled: true})
            }
        }
    }

    // deleteSubProject = (index) => {
    //     const { subProjects } = this.state;
    //     subProjects.splice(index, 1);
    //     this.setState({subProjects: subProjects})
    // }

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
        //The user id will be the person attached to the parent project
        //Get the parentProjectGuid from somewhere
        //Add the new project to the local state

        const { subProjects, selectedImageIndex } = this.state;
        const { newProjectValues, tags } = this.props;

        const newSubProject = {
            name: newProjectValues.projectNameInput,
            description: newProjectValues.descriptionInput,
            taskList: newProjectValues.taskList,
            tagList: tags,
            imageIndex: selectedImageIndex,
            guid: uuidv4()
        };

        subProjects.push(newSubProject);

        //this.props.postProject(userguid, this.props.values, this.state.selectedImageIndex);
        this.setState({
            modalVisible: false, 
            subProjects: subProjects,
            submitButtonDisabled: true,
            selectedImageIndex: -1
        });

        //Do a redux action to reset the state of the store
        //In the redux action for creating project can you reset the form state?

    };

    render() {
        var photoList = Object.keys(images);

        const { subProjects } = this.state;
        const { tags } = this.props;

        if(subProjects.length === 0) {
            
            return (
                <Segment placeholder style={{marginRight: '5em', marginLeft: '5em'}}>
                    <Header icon>
                        There are no Sub Projects for this project.
                    </Header>
                    <Button onClick={this.showModal}>Would you like to create one?</Button>
                    <TransitionablePortal open={this.state.modalVisible}
                                          transition={{animation: 'fade up', duration: 500}}>
                        <Modal open={true} onClose={this.closeModal} closeIcon>
                            <Modal.Header>Create a New Project</Modal.Header>
                            <Modal.Content>
                                <NewProjectForm updateSelectedImageIndex={this.updateSelectedImageIndex} isSubProject={true} tags={tags}/>
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
        else {

            return(
                <Segment style={{ marginLeft: '5em', marginRight: '5em'}}>
                    <Item.Group link divided>
                        {subProjects.map((project, index) => {
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
                    <Button onClick={this.showModal}>Would you like to create another Sub Project?</Button>
                    <TransitionablePortal open={this.state.modalVisible}
                                          transition={{animation: 'fade up', duration: 500}}>
                        <Modal open={true} onClose={this.closeModal} closeIcon>
                            <Modal.Header>Create a New Project</Modal.Header>
                            <Modal.Content>
                                <NewProjectForm updateSelectedImageIndex={this.updateSelectedImageIndex} isSubProject={true} tags={tags}/>
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
        }
  }
}

function mapDispatchToProps(dispatch) {
    return {
        //fetchSubProjects: (parentProjectGuid) => dispatch(fetchSubProjects(parentProjectGuid)),
        //postSubProject: (parentProjectGuid, subProject) => dispatch(postSubProject(parentProjectGuid, subProject))
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
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SubProjectList);
