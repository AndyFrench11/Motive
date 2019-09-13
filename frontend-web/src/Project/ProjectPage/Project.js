import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, Label, Menu, Transition, List, Button, Icon, Card,
} from 'semantic-ui-react'

import TopNavBar from '../../Common/TopNavBar'
import Footer from '../../Common/Footer'
import BookImage from '../ProjectImages/image15.png'
import {connect} from "react-redux";
import {fetchProject, fetchProjectProfiles} from "../actions";
import LoaderInlineCentered from "../../Common/Loader";
import ProjectTasks from "./ProjectTasks";

function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

const images = importAll(require.context('.././ProjectImages', false, /\.(png|jpe?g|svg)$/));


class ProjectPageLayout extends React.Component {
    state = { activeMenuItem: "Updates" };

    handleItemClick = (e, { name }) => this.setState({ activeMenuItem: name });
    handleTaskButtonClick = () => this.setState({ activeTaskButton: !this.state.activeTaskButton });

    componentDidMount() {
        const { dispatch } = this.props;
        const { userguid, projectguid } = this.props.match.params;
        dispatch(fetchProject(projectguid, userguid));
        //dispatch(fetchProjectProfiles(projectguid))
    }

    renderProjectImage(imageIndex) {
        var photoList = Object.keys(images);
        return (
            <Grid.Column width={4}>
                <Image style={{'border-radius':8}} src={images[photoList[imageIndex]]} size='small' />
            </Grid.Column>
        );
    }

    renderProjectDetails(project) {
        return (
            <Grid.Column width={9}>
                <Grid.Row>
                    <Header as='h1'>{project.name}</Header>
                </Grid.Row>
                <Grid.Row>
                    <p>{project.description}</p>
                </Grid.Row>
                <Grid.Row>
                    {project.tagList.map((tag, index) =>
                        <Label key={index} >
                            #{project.tagList[index].name}
                        </Label>
                    )}
                </Grid.Row>
            </Grid.Column>
        );
    }

    renderProjectOwners() {
        let owner = {
            name: 'Andy Pandy'
        }
        if (this.props.profiles === null || this.props.profiles === undefined) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            )
        } else {
            return (
                <Grid.Column width={3}>
                    <Grid.Row>
                        <Image avatar floated='right' src='https://react.semantic-ui.com/images/avatar/large/matthew.png' size="tiny"/>
                    </Grid.Row>
                    <Grid.Row>
                        <span>Owned by {owner.name}</span>
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
            const { activeMenuItem, activeTaskButton } = this.state;

            return (
                <div>

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

