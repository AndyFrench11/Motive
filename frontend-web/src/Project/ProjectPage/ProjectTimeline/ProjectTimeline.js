import React from 'react'
import {
    Divider, Grid, Popup, Icon, Label, Image, Header, Segment
} from 'semantic-ui-react'
import {connect} from "react-redux";
import "./ProjectTimeline.css";
import TrophyImage from "../../ProjectImages/image16.png";
import MatthewImage from "../../../Images/matthew_nuezrz.png";

class ProjectTimeline extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {

        const { updates } = this.props;
        console.log(updates);

        return (
            <Grid columns={updates.length} style={{'marginLeft': '5em', 'marginRight': '5em', 'marginTop': '2em', 'marginBottom': '2em'}} >
                {updates.map((update, index) => (
                    <Grid.Column className="timelineColumn">
                        <Grid>
                            <Grid.Column className="connector" >
                                <Divider/>
                            </Grid.Column>
                            <Grid.Column compact className="centerDot">
                                <Popup
                                    trigger={<Icon color='red' size='large' circular />}
                                    position='top center'
                                    className="timelineItemPopup"
                                    >
                                    <Label floating color='red' circular icon="heart" size="massive" className="timelineHighlight"/>
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
                        </Grid>
                    </Grid.Column>
                ))}

            </Grid>
        );
  }
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

const mapStateToProps = state => {

};


export default connect(mapStateToProps, mapDispatchToProps)(ProjectTimeline);
