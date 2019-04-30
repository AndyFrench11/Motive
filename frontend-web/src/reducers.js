import { combineReducers } from 'redux'
import {
    REQUEST_POSTS,
    RECEIVE_POSTS,
    RECEIVE_NEW_PROJECT_RESPONSE,
    REQUEST_NEW_PROJECT
} from './actions'
import {reducer as formReducer} from "redux-form";
import profilePage from "./UserProfile/reducers";


function posts(
    state = {
        isFetching: false,
        result: []
    },
    action
) {
    switch (action.type) {
        case REQUEST_POSTS:
            return Object.assign({}, state, {
                isFetching: true,
            });
        case RECEIVE_POSTS:
            return Object.assign({}, state, {
                isFetching: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}

function postsBySubreddit(state = {}, action) {
    switch (action.type) {
        case RECEIVE_POSTS:
        case REQUEST_POSTS:
            return posts(state, action);
        default:
            return state
    }
}

function newProject(
    state = {
        isPosting: false,
        result: ""
    },
    action
) {
    switch (action.type) {
        case REQUEST_NEW_PROJECT:
            return Object.assign({}, state, {
                isPosting: true,
            });
        case RECEIVE_NEW_PROJECT_RESPONSE:
            return Object.assign({}, state, {
                isPosting: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}

function projectController(state = {}, action) {
    switch (action.type) {
        case REQUEST_NEW_PROJECT:
        case RECEIVE_NEW_PROJECT_RESPONSE:
            return newProject(state, action);
        default:
            return state
    }
}



const rootReducer = combineReducers({
    form: formReducer,
    postsBySubreddit,
    projectController,
    profilePage
});

export default rootReducer