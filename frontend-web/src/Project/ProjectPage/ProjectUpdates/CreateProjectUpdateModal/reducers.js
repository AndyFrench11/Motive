import { combineReducers } from 'redux'
import {
    REQUEST_NEW_PROJECT_UPDATE, 
    RECEIVE_NEW_PROJECT_UPDATE_RESPONSE
} from './actions'

function addProjectUpdate(
    state = {
        isUpdating: false,
        result: ""
    },
    action
) {
    switch (action.type) {
        case REQUEST_NEW_PROJECT_UPDATE:
            return Object.assign({}, state, {
                isUpdating: true,
            });
        case RECEIVE_NEW_PROJECT_UPDATE_RESPONSE:
            return Object.assign({}, state, {
                isUpdating: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}


function createProjectUpdateController(state = {}, action) {
    switch (action.type) {
        case REQUEST_NEW_PROJECT_UPDATE:
        case RECEIVE_NEW_PROJECT_UPDATE_RESPONSE:
            addProjectUpdate(state, action)
        default:
            return state;

    }
}

const createProjectUpdateReducer = combineReducers({
    createProjectUpdateController
});

export default createProjectUpdateReducer