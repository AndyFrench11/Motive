import { combineReducers } from 'redux'
import {
    REQUEST_SINGLE_PROJECT,
    RECEIVE_SINGLE_PROJECT,
    RECEIVE_NEW_PROJECT_RESPONSE,
    REQUEST_NEW_PROJECT,
} from './actions'
import {reducer as formReducer} from "redux-form";


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

function createProjectController(state = {}, action) {
    switch (action.type) {
        case REQUEST_NEW_PROJECT:
        case RECEIVE_NEW_PROJECT_RESPONSE:
            return newProject(state, action);
        default:
            return state
    }
}

function retrieveProject(
    state = {
        isRetrieving: false,
        result: ""
    },
    action
) {
    switch (action.type) {
        case REQUEST_SINGLE_PROJECT:
            return Object.assign({}, state, {
                isRetrieving: true,
            });
        case RECEIVE_SINGLE_PROJECT:
            return Object.assign({}, state, {
                isRetrieving: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}

function projectController(state = {}, action) {
    switch (action.type) {
        case RECEIVE_SINGLE_PROJECT:
        case REQUEST_SINGLE_PROJECT:
            return retrieveProject(state, action);
        default:
            return state
    }
}



const rootReducer = combineReducers({
    form: formReducer,
    createProjectController,
    projectController
});

export default rootReducer