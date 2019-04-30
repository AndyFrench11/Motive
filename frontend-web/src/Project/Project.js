import React from 'react'
import {
    Divider, Grid, Header, Image, Segment, Dimmer, Loader,
} from 'semantic-ui-react'

import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'
import BookImage from '../Images/Hobbies Icons/010-book.png'
import {connect} from "react-redux";
import {fetchProject} from "../actions";



class ProjectPageLayout extends React.Component {

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(fetchProject(13));
    }

    checkRender() {
        if(typeof this.props.result === 'undefined') {
            return null
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

              {!isRetrieving &&
                this.checkRender()
              }


            {isRetrieving &&
                <div>
                    <Segment style={{ marginTop: '5em' }}>
                        <Dimmer active inverted>
                            <Loader inverted content='Loading' />
                        </Dimmer>
                    </Segment>
                </div>
            }

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

// AsyncApp.propTypes = {
//     selectedSubreddit: PropTypes.string.isRequired,
//     posts: PropTypes.array.isRequired,
//     isFetching: PropTypes.bool.isRequired,
//     lastUpdated: PropTypes.number,
//     dispatch: PropTypes.func.isRequired
// }
//
// function mapStateToProps(state) {
//     const { selectedSubreddit, postsBySubreddit } = state
//     const { isFetching, lastUpdated, items: posts } = postsBySubreddit[
//         selectedSubreddit
//         ] || {
//         isFetching: true,
//         items: []
//     }
//
//     return {
//         selectedSubreddit,
//         posts,
//         isFetching,
//         lastUpdated
//     }
// }


//
// componentDidUpdate(prevProps) {
//     if (this.props.selectedSubreddit !== prevProps.selectedSubreddit) {
//         const { dispatch, selectedSubreddit } = this.props
//         dispatch(fetchPostsIfNeeded(selectedSubreddit))
//     }
// }
//
// handleChange(nextSubreddit) {
//     this.props.dispatch(selectSubreddit(nextSubreddit))
//     this.props.dispatch(fetchPostsIfNeeded(nextSubreddit))
// }
//
// handleRefreshClick(e) {
//     e.preventDefault()
//
//     const { dispatch, selectedSubreddit } = this.props
//     dispatch(invalidateSubreddit(selectedSubreddit))
//     dispatch(fetchPostsIfNeeded(selectedSubreddit))
// }
