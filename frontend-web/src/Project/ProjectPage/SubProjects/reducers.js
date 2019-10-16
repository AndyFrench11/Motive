import { combineReducers } from 'redux'
import {
    REQUEST_SUB_PROJECTS, 
    RECEIVE_SUB_PROJECTS,
    REQUEST_NEW_SUBPROJECT,
    RECEIVE_NEW_SUBPROJECT_RESPONSE
} from './actions'

function addSubProject(
    state = {
        isUpdating: false,
        result: ""
    },
    action
) {
    switch (action.type) {
        case REQUEST_NEW_SUBPROJECT:
            return Object.assign({}, state, {
                isUpdating: true,
            });
        case RECEIVE_NEW_SUBPROJECT_RESPONSE:
            return Object.assign({}, state, {
                isUpdating: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}

function subProjectController(state = {}, action) {
    switch (action.type) {
        case REQUEST_SUB_PROJECTS:
            return {...state,
                isRetrievingSubProjects: true
            };
        case RECEIVE_SUB_PROJECTS:
            return {...state,
                isRetrievingSubProjects: false,
                subProjects: action.subProjects
            };
        case REQUEST_NEW_SUBPROJECT:
        case RECEIVE_NEW_SUBPROJECT_RESPONSE:
            addSubProject(state, action);
        default:
            return state
    }
}

const subProjectReducer = combineReducers({
    subProjectController
});

export default subProjectReducer