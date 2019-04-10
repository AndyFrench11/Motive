import React from 'react'
import {
    Container,
    Divider,
    Dropdown,
    Grid,
    Header,
    Image,
    List,
    Menu,
    Segment,
    Button,
    Modal,
    Input,
    TransitionablePortal,
    Form,
    Checkbox
} from 'semantic-ui-react'

import { fetchPosts } from '../actions'

import TopNavBar from '../Common/TopNavBar'
import Footer from '../Common/Footer'

import SteveImage from '../Images/steve.jpg'
import BookImage from '../Images/Hobbies Icons/010-book.png'

import { Field, reduxForm } from "redux-form";
import ModalForm from "./ModalForm";
import { connect } from "react-redux";

class ProjectPageLayout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false
        };
    }

    showModal = () => {
        this.setState({
            modalVisible: true
        });
    };

    closeModal = () => {
        this.setState({
            modalVisible: false
        });
    };

    handleModalSubmit = () => {
        console.log("Hey");
        console.log(this.props);
        this.props.dispatch(fetchPosts())
    };


    render() {

    return (
      <div>
        <TopNavBar/>

          <TransitionablePortal open={this.state.modalVisible}  transition={{ animation:'fade up', duration: 500 }}>
          <Modal open={true} onClose={this.closeModal} closeIcon>
              <Modal.Header>Create a New Project</Modal.Header>
              <Modal.Content>
                  <ModalForm onSubmit={this.handleModalSubmit}/>
              </Modal.Content>
              <Modal.Actions>
                  <Button color='grey' onClick={this.close}>
                      Cancel
                  </Button>
                  <Button
                      positive
                      icon='checkmark'
                      labelPosition='right'
                      content="All good to go!"
                      onClick={this.handleModalSubmit}
                  />
              </Modal.Actions>
          </Modal>
          </TransitionablePortal>

        <Button style={{ marginTop: '5em' }} onClick={this.showModal}>Create Project</Button>

        <Grid divided='vertically' style={{ marginTop: '5em' }} centered>
        <Grid.Row columns={2}>
        <Grid.Column width={2}>
            <Image style={{'border-radius':8}} src={BookImage} size='small' />
        </Grid.Column>
        <Grid.Column centered>
        <Header as='h1'>Project Title</Header>
            <p>Description</p>

        </Grid.Column>
        </Grid.Row>

        <Divider/>

        </Grid>

      <Footer/>
    </div>
    );
  }
}

const mapStateToProps = state => {
    const { postsBySubreddit } = state;
    const { isFetching, lastUpdated, result } = postsBySubreddit;
    return state.form.createProject
        ? {
            values: state.form.createProject.values,
            submitSucceeded: state.form.createProject.submitSucceeded,
            isFetching: isFetching,
            result: result,
            lastUpdated: lastUpdated,
        }
        : {};
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

// componentDidMount() {
//     const { dispatch, selectedSubreddit } = this.props
//
//
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