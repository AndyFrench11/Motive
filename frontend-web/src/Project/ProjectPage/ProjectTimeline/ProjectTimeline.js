import React from 'react'
import {
    Divider, Grid, Popup, Icon, Label, Image, Header, Segment
} from 'semantic-ui-react'
import {connect} from "react-redux";
import "./ProjectTimeline.css";
import TrophyImage from "../../ProjectImages/image16.png";
import MatthewImage from "../../../Images/matthew_nuezrz.png";
import Moment from 'moment';
import LoaderInlineCentered from "../../../Common/Loader";

const colorMap = ['#eb4034', '#ebb734', '#a2eb34', '#34e5eb', '#346beb', '#9634eb', '#eb34e2', '#eb347a']

class ProjectTimeline extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {

        const { isRetrievingProjectUpdates } = this.props;
        if (isRetrievingProjectUpdates) {
            return (
                <Grid divided='vertically' style={{marginTop: '5em'}} centered>
                    <LoaderInlineCentered/>
                </Grid>
            )
        } else {
        
            const { updates, tasks } = this.props;

            //Only get the five most recent updates
            const mostRecentUpdates = updates.sort((a, b) => (a.dateTimeCreated > b.dateTimeCreated) ? 1 : ((b.dateTimeCreated > a.dateTimeCreated) ? -1 : 0)).slice(-4);

            //Only get the five left over top tasks that are not completed
            const upcomingTasks = tasks.filter((task) => !task.completed).slice(-4);

            const leftOverCircles = 8 - (mostRecentUpdates.length + upcomingTasks.length)
            const extraCircle = leftOverCircles > 0;

            return (
                <Grid style={{'marginLeft': '5em', 'marginRight': '5em', 'marginTop': '0em', 'marginBottom': '0em'}} >
                    <Grid.Row style={{'paddingTop': '0em'}}>
                        <Header dividing>Timeline</Header>
                    </Grid.Row>
                    {mostRecentUpdates.map((update, index) => {
                        const itemColor = colorMap[index];
                        const dateTime = new Date(update.dateTimeCreated);
                        const momentTime = Moment(dateTime).format("MMM Do"); 

                        return (
                            <Grid.Column className="timelineColumn">
                                <Grid>
                                    <Grid.Row>
                                        <Grid.Column className="connector" >
                                            <Divider/>
                                        </Grid.Column>
                                        <Grid.Column compact className="centerDot">
                                            <Popup
                                                trigger={<Icon style={{'backgroundColor': itemColor}} size='large' circular />}
                                                position='top center'
                                                className="timelineItemPopup"
                                                >
                                                {update.highlight ? 
                                                    <Label floating color='red' circular icon="heart" size="massive" className="timelineHighlight"/>
                                                : 
                                                    null
                                                }
                                                <Grid divided compact>
                                                    <Grid.Row className="popUpRow">
                                                        <Grid.Column width={4} className="popUpProfileImage">
                                                            <Image className="popUpImage" avatar src={MatthewImage} size='small'/>
                                                        </Grid.Column>
                                                        <Grid.Column width={12}>
                                                            <Header className="popUpName" size='medium'> {update.relatedPerson.firstName} {update.relatedPerson.lastName} </Header>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Divider className="popUpDivider"/>
                                                    {update.relatedTask !== null && (
                                                        update.relatedTask.completed ? 
                                                                <Grid.Row className="taskPopUpRow">
                                                                    <Grid>
                                                                        <Grid.Column width={3} className="trophyImageColumn">
                                                                            <Image src={TrophyImage} rounded className="trophyImage"/>
                                                                        </Grid.Column>
                                                                        <Grid.Column width={12}>
                                                                            <Header style={{'marginTop': 3}} size='medium'>Task Completed: {update.relatedTask.name}</Header>
                                                                        </Grid.Column>
                                                                    </Grid>
                                                                </Grid.Row>
                                                        :
                                                                <Grid.Row className="taskPopUpRow">
                                                                    <Grid>
                                                                        <Grid.Column width={2}>
                                                                            <Icon size='large' name='tasks' className='taskIcon'/>
                                                                        </Grid.Column>
                                                                        <Grid.Column width={14}>
                                                                            <Header style={{'marginTop': 3}} size='medium'>Task: {update.relatedTask.name}</Header>
                                                                        </Grid.Column>
                                                                    </Grid>
                                                                </Grid.Row>
                                                    )}
                                                    {update.relatedTask !== null &&
                                                        <Divider className="popUpDivider"/>
                                                    }
                                                    <Grid.Row className="popUpRow">
                                                        <p>{update.content}</p>
                                                    </Grid.Row>
                                                </Grid>
                                            </Popup>
                                        </Grid.Column>
                                        <Grid.Column className="connector">
                                            <Divider/>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row centered style={{'paddingTop': '0em'}}>
                                        <p>{momentTime}</p>
                                    </Grid.Row>
                                    
                                </Grid>
                            </Grid.Column>
                    )})}

                    {upcomingTasks.map((task, index) => {

                        return (
                            <Grid.Column className="timelineColumn">
                                <Grid>
                                    <Grid.Column className="connector" >
                                        <Divider/>
                                    </Grid.Column>
                                    <Grid.Column compact className="centerDot">
                                        <Popup
                                            trigger={<Icon className="emptyTimeLineIcon" size='large' circular />}
                                            position='top center'
                                            className="timelineItemPopup"
                                            >
                                            <Grid divided compact>
                                                <Grid.Row className="popUpRow">
                                                    <Grid.Column width={3} className="popUpTaskImage">
                                                        <Icon size='large' name='tasks'/>
                                                    </Grid.Column>
                                                    <Grid.Column width={12}>
                                                        <Header className="popUpName" size='medium'> Next task: </Header>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Divider className="popUpDivider"/>
                                                <Grid.Row className="popUpRow">
                                                    <p>{task.name}</p>
                                                </Grid.Row>
                                            </Grid>
                                        </Popup>
                                    </Grid.Column>
                                    <Grid.Column className="connector">
                                        <Divider/>
                                    </Grid.Column>
                                </Grid>
                            </Grid.Column>
                        )})}

                    {extraCircle ? 
                            <Grid.Column className="timelineColumn">
                                <Grid>
                                    <Grid.Column className="connector" >
                                        <Divider/>
                                    </Grid.Column>
                                    <Grid.Column compact className="centerDot">
                                        <Popup
                                            trigger={<Icon className="emptyTimeLineIcon" size='large' circular name='ellipsis horizontal' />}
                                            position='top center'
                                            content="Add another task or update to populate this timeline."
                                            >
                                        </Popup>
                                    </Grid.Column>
                                    <Grid.Column className="connector">
                                        <Divider/>
                                    </Grid.Column>
                                </Grid>
                            </Grid.Column>
                    :
                        null
                    }

                </Grid>
            );
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

const mapStateToProps = state => {
    const { projectUpdateReducer } = state;
    const { projectUpdateController } = projectUpdateReducer;
    const { isRetrievingProjectUpdates, updates} = projectUpdateController;

    return {
        isRetrievingProjectUpdates: isRetrievingProjectUpdates,
        updates: updates,
        projectGuid: state.projectController.result.guid
    }

};


export default connect(mapStateToProps, mapDispatchToProps)(ProjectTimeline);
