import { combineReducers } from 'redux'
import {
    REQUEST_DELETE_PROJECT,
    RECEIVE_DELETE_PROJECT_RESPONSE
} from './actions'

function deleteProject(
    state = {
        isUpdating: false,
        result: ""
    },
    action
) {
    switch (action.type) {
        case REQUEST_DELETE_PROJECT:
            return Object.assign({}, state, {
                isUpdating: true,
            });
        case RECEIVE_DELETE_PROJECT_RESPONSE:
            return Object.assign({}, state, {
                isUpdating: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}


function projectSettingsController(state = {}, action) {
    switch (action.type) {
        case REQUEST_DELETE_PROJECT:
        case RECEIVE_DELETE_PROJECT_RESPONSE:
            deleteProject(state, action)
        default:
            return state;

    }
}

const projectSettingsReducer = combineReducers({
    projectSettingsController
});

export default projectSettingsReducer