import { combineReducers } from 'redux'
import {
    RECEIVE_NEW_PROJECT_RESPONSE,
    REQUEST_NEW_PROJECT,
    RECEIVE_LOGIN_RESPONSE,
    REQUEST_LOGIN
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

function projectController(state = {}, action) {
    switch (action.type) {
        case REQUEST_NEW_PROJECT:
        case RECEIVE_NEW_PROJECT_RESPONSE:
            return newProject(state, action);
        default:
            return state
    }
}

function loginController(state = {
    isPosting: false,
    result: ""
    }, action) {
    switch (action.type) {
        case REQUEST_LOGIN:
            return Object.assign({}, state, {
                isPosting: true,
            });
        case RECEIVE_LOGIN_RESPONSE:
            return Object.assign({}, state, {
                isPosting: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}



const rootReducer = combineReducers({
    form: formReducer,
    projectController,
    loginController
});

export default rootReducer