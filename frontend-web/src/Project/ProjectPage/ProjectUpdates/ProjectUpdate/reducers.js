import { combineReducers } from 'redux'
import {
    REQUEST_PROJECT_UPDATES, 
    RECEIVE_PROJECT_UPDATES
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
        default:
            return state
    }
}

const projectUpdateReducer = combineReducers({
    projectUpdateController
});

export default projectUpdateReducer
