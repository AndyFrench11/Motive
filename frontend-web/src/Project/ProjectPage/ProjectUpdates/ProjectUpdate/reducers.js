import { combineReducers } from 'redux'
import {
    REQUEST_PROJECT_UPDATES, 
    RECEIVE_PROJECT_UPDATES,
    REQUEST_UPDATE_PROJECT_UPDATE_CONTENT,
    RECEIVE_UPDATE_PROJECT_UPDATE_CONTENT_RESPONSE,
    REQUEST_DELETE_PROJECT_UPDATE,
    RECEIVE_DELETE_PROJECT_UPDATE_RESPONSE
} from './actions'

function projectUpdateController(state = {}, action) {
    switch (action.type) {
        case REQUEST_PROJECT_UPDATES:
            return {...state,
                isRetrievingProjectUpdates: true
            };
        case RECEIVE_PROJECT_UPDATES:
            return {...state,
                isRetrievingProjectUpdates: false,
                updates: action.updates
            };
        case REQUEST_UPDATE_PROJECT_UPDATE_CONTENT:
        case RECEIVE_UPDATE_PROJECT_UPDATE_CONTENT_RESPONSE:
            updateProjectUpdateContent(state, action);
        case REQUEST_DELETE_PROJECT_UPDATE:
        case RECEIVE_DELETE_PROJECT_UPDATE_RESPONSE:
            deleteProjectUpdate(state, action);
        default:
            return state
    }
}

function updateProjectUpdateContent(
    state = {
        isUpdating: false,
        result: ""
    },
    action
) {
    switch (action.type) {
        case REQUEST_UPDATE_PROJECT_UPDATE_CONTENT:
            return Object.assign({}, state, {
                isUpdating: true,
            });
        case RECEIVE_UPDATE_PROJECT_UPDATE_CONTENT_RESPONSE:
            return Object.assign({}, state, {
                isUpdating: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}

function deleteProjectUpdate(
    state = {
        isUpdating: false,
        result: ""
    },
    action
) {
    switch (action.type) {
        case REQUEST_DELETE_PROJECT_UPDATE:
            return Object.assign({}, state, {
                isUpdating: true,
            });
        case RECEIVE_DELETE_PROJECT_UPDATE_RESPONSE:
            return Object.assign({}, state, {
                isUpdating: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}

const projectUpdateReducer = combineReducers({
    projectUpdateController
});

export default projectUpdateReducer
