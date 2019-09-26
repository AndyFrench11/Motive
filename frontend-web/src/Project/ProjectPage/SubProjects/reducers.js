import { combineReducers } from 'redux'
import {
    REQUEST_SUB_PROJECTS, 
    RECEIVE_SUB_PROJECTS
} from './actions'

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
        default:
            return state
    }
}

const subProjectReducer = combineReducers({
    subProjectController
});

export default subProjectController