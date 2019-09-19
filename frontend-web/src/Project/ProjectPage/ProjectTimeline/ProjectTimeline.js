import React from 'react'
import {
    Divider, Grid, Popup, Icon, Label, Image, Header
} from 'semantic-ui-react'
import {connect} from "react-redux";
import "./ProjectTimeline.css";

class ProjectTimeline extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {

        const { updates } = this.props;

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
                                    >
                                    <Grid divided>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <Icon name='heart'/>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Header size='medium'> {update.relatedPerson.firstName} </Header>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Divider/>
                                        <Grid.Row>
                                            <p style={{'marginLeft': '1em', 'marginRight': '1em'}}>{update.content}</p>
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
