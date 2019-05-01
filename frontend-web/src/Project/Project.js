import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, Dimmer, Loader,
} from 'semantic-ui-react'

import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'
import BookImage from '../Images/Hobbies Icons/010-book.png'
import {connect} from "react-redux";
import {fetchProject} from "../actions";
import LoaderInlineCentered from "../Common/Loader";


class ProjectPageLayout extends React.Component {

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
            return (<div>
                <Grid divided='vertically' style={{ marginTop: '5em' }} centered>
                    <Grid.Row columns={2}>
                        <Grid.Column width={2}>
                            <Image style={{'border-radius':8}} src={BookImage} size='small' />
                        </Grid.Column>
                        <Grid.Column centered>
                            <Header as='h1'>{result.name}</Header>
                            <p>{result.description}</p>
                        </Grid.Column>
                    </Grid.Row>

                    <Divider/>

                </Grid>
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

