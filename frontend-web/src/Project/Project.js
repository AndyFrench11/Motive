import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, Label, Menu,
} from 'semantic-ui-react'

import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'
import BookImage from '../Images/Hobbies Icons/010-book.png'
import {connect} from "react-redux";
import {fetchProject} from "../actions";
import LoaderInlineCentered from "../Common/Loader";


class ProjectPageLayout extends React.Component {
    state = { activeItem: 'home' };

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });


    componentDidMount() {
        const { dispatch } = this.props;
        const { userguid, projectguid } = this.props.match.params;
        dispatch(fetchProject(projectguid, userguid));
    }

    checkRender() {
        if(typeof this.props.result === 'undefined') {
            return(<Grid divided='vertically' style={{marginTop: '5em'}} centered>
                <LoaderInlineCentered/>
            </Grid>)
        } else {
            const { result } = this.props;
            const { activeItem } = this.state;

            return (<div>
                <Grid divided='vertically' style={{ marginTop: '5em' }} centered>
                    <Grid.Row columns={2}>
                        <Grid.Column width={2}>
                            <Image style={{'border-radius':8}} src={BookImage} size='small' />
                        </Grid.Column>
                        <Grid.Column centered>
                            <Grid.Row>
                                <Header as='h1'>{result.name}</Header>
                            </Grid.Row>
                            <Grid.Row>
                                <p>{result.description}</p>
                            </Grid.Row>
                            <Grid.Row>
                                {result.tagList.map((tag, index) =>
                                    <Label key={index} >
                                        #{result.tagList[index].name}
                                    </Label>
                                )}
                            </Grid.Row>

                        </Grid.Column>
                    </Grid.Row>
                </Grid>

                    <Divider style={{ marginLeft: '5em', marginRight: '5em'}}/>


                    <Menu pointing secondary style={{ marginLeft: '5em', marginRight: '5em'}}>
                        <Menu.Item
                            name='Updates'
                            active={activeItem === 'Updates'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Tasks'
                            active={activeItem === 'Tasks'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name='Highlights'
                            active={activeItem === 'Highlights'}
                            onClick={this.handleItemClick}
                        />
                    </Menu>

                    {activeItem === "Tasks" &&
                        <Segment style={{ marginLeft: '5em', marginRight: '5em'}}>
                            Tasks
                        </Segment>
                    }

                    {activeItem === "Updates" &&
                        <Segment style={{ marginLeft: '5em', marginRight: '5em'}}>
                            Updates
                        </Segment>
                    }

                    {activeItem === "Highlights" &&
                        <Segment style={{ marginLeft: '5em', marginRight: '5em'}}>
                            Highlights
                        </Segment>
                    }

            </div>
            )
        }
    }

    render() {

        const { isRetrieving, result, lastUpdated } = this.props;

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
    const { projectController } = state;
    const { isRetrieving, lastUpdated, result } = projectController;
    return {
        isRetrieving: isRetrieving,
        result: result,
        lastUpdated: lastUpdated,
    };
};

export default connect(mapStateToProps)(ProjectPageLayout);

