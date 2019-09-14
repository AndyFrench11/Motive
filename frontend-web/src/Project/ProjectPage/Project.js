import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, Label, Menu, Input, Button, Icon, Card,
} from 'semantic-ui-react'

import TopNavBar from '../../Common/TopNavBar'
import Footer from '../../Common/Footer'
import {connect} from "react-redux";
import {fetchProject, fetchProjectProfiles} from "../actions";
import LoaderInlineCentered from "../../Common/Loader";
import ProjectTasks from "./ProjectTasks";
import ProjectTags from "./ProjectTags";
import ProjectName from "./ProjectName";
import ProjectDescription from "./ProjectDescription";
import ProjectSettings from "./ProjectSettings";
import UpdateProjectImageModal from "./UpdateProjectImageModal";

function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

const images = importAll(require.context('.././ProjectImages', false, /\.(png|jpe?g|svg)$/));


class ProjectPageLayout extends React.Component {
    state = { 
        activeMenuItem: "Updates",
        updatingProjectImage: false
    };

    handleItemClick = (e, { name }) => this.setState({ activeMenuItem: name });
    handleTaskButtonClick = () => this.setState({ activeTaskButton: !this.state.activeTaskButton });

    componentDidMount() {
        const { dispatch } = this.props;
        const { projectguid } = this.props.match.params;
        dispatch(fetchProject(projectguid));
        dispatch(fetchProjectProfiles(projectguid));
    }

    showUpdateProjectPhotoModal = () => {
        this.setState({ updatingProjectImage: true })
    }   

    closeUpdateProjectModal = () => {
        this.setState({ updatingProjectImage: false })
    }

    renderProjectImage(imageIndex) {
        var photoList = Object.keys(images);
        return (
            <Grid.Column width={4}>
                <Image 
                    style={{ 'border-radius': 8, 'border-color': '#dddddd', 'border-width': '2px', 'borderStyle': 'solid'}}
                    className='ProjectImage'
                    src={images[photoList[imageIndex]]} 
                    size='small' 
                    onClick={this.showUpdateProjectPhotoModal}/>
            </Grid.Column>
        );
    }

    renderProjectDetails(project) {
        return (
            <Grid.Column width={9}>
                <ProjectName projectName={project.name}/>
                <ProjectDescription projectDescription={project.description}/>
                <ProjectTags tagList={project.tagList}/>
            </Grid.Column>
        );
    }

    renderProjectOwners() {
        let owner = {
            name: 'Andy Pandy'
        }
        if (this.props.projectOwners === null || this.props.projectOwners === undefined) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            )
        } else {
            const { projectOwners } = this.props;
            let ownerString = "";
            for(var i = 0; i < projectOwners.length; i++) {
                const owner = projectOwners[i];
                ownerString += `${owner.firstName} ${owner.lastName}`
                if (projectOwners.length > 1) {
                    if (i === projectOwners.length - 2) {
                        ownerString += " and ";
                    } else if(i !== projectOwners.length - 1) {
                        ownerString += ", "
                    }
                }
            }
            //Do something to check if the number of owners is greater than some threshold
            return (
                <Grid.Column width={3}>
                    <Grid.Row>
                        {projectOwners.map((owner, index) => (
                            <Image avatar floated='right' src='https://react.semantic-ui.com/images/avatar/large/matthew.png' size="tiny"/>
                        ))}
                    </Grid.Row>
                    <Grid.Row>
                        <span>Owned by {ownerString}</span>
                    </Grid.Row>

                </Grid.Column>
            );
        }

    }

    checkRender() {

        if (this.props.project === null || this.props.project === undefined) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            )
        } else {
            const { project } = this.props;
            const { activeMenuItem, updatingProjectImage } = this.state;

            return (
                <div>
            
                {updatingProjectImage && 
                    <UpdateProjectImageModal closeCallback={this.closeUpdateProjectModal}/>
                }

                <Grid container style={{ marginTop: '5em', marginLeft: '5em', marginRight: '5em' }}>
                    {this.renderProjectImage(project.imageIndex)}
                    {this.renderProjectDetails(project)}
                    {this.renderProjectOwners()}
                </Grid>

                    <Divider style={{ marginLeft: '5em', marginRight: '5em'}}/>

                    <Menu pointing secondary style={{ marginLeft: '5em', marginRight: '5em'}}>
                        <Menu.Item
                            name='Updates'
                            active={activeMenuItem === 'Updates'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Tasks'
                            active={activeMenuItem === 'Tasks'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Highlights'
                            active={activeMenuItem === 'Highlights'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Settings'
                            active={activeMenuItem === 'Settings'}
                            onClick={this.handleItemClick}
                        />
                    </Menu>

                    {activeMenuItem === "Tasks" &&

                        /*Tasks*/
                        <ProjectTasks taskList={project.taskList} projectGuid={project.guid}/>

                    }

                    {activeMenuItem === "Updates" &&

                        /*Tasks*/

                        <Segment style={{ marginLeft: '5em', marginRight: '5em'}}>
                            <Card>
                                <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' />
                                <Card.Content>
                                    <Card.Header>Matthew</Card.Header>
                                    <Card.Meta>
                                        <span className='date'>Joined in 2015</span>
                                    </Card.Meta>
                                    <Card.Description>Matthew is a musician living in Nashville.</Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <a>
                                        <Icon name='user' />
                                        22 Friends
                                    </a>
                                </Card.Content>
                            </Card>
                        </Segment>
                    }

                    {activeMenuItem === "Highlights" &&

                        /*Tasks*/

                        <Segment style={{ marginLeft: '5em', marginRight: '5em'}}>
                            Highlights
                        </Segment>
                    }

                    {activeMenuItem === "Settings" &&
                        <ProjectSettings/>
                    }

            </div>
            )
        }
    }

    render() {
        return (
          <div>
            <TopNavBar/>
              {this.checkRender()}
          <Footer/>
        </div>
        );
  }
}

const mapStateToProps = state => {
    const { projectController, projectOwnersController } = state;
    const { isRetrieving, lastUpdated, result } = projectController;
    const { isRetrievingOwners, owners } = projectOwnersController;
    return {
        isRetrieving: isRetrieving,
        project: result,
        lastUpdated: lastUpdated,
        projectOwners: owners,
        isRetrievingOwners: isRetrievingOwners
    };
};

export default connect(mapStateToProps)(ProjectPageLayout);

