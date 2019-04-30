import { combineReducers } from 'redux'
import {
    REQUEST_PROJECTS,
    RECEIVE_PROJECTS
} from './actions'

const initialState = {
    projects: {
        isFetching: false,
        items: []
    }
};

function projects(state = initialState, action) {
    switch (action.type) {
        case REQUEST_PROJECTS:
            return {...state,
                projects: {
                    isFetching: true,
                    items: []
                }
            };
        case RECEIVE_PROJECTS:
            return {...state,
                projects: {
                    isFetching: false,
                    items: state.projects.items.add(action.projects),
                    lastUpdated: action.receivedAt
                }
            };
        default:
            return state
    }
}

const rootReducer = combineReducers({
    projects
});

export default rootReducer