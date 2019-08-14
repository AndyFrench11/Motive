import { combineReducers } from 'redux'
import {
    REQUEST_PROJECTS,
    RECEIVE_PROJECTS, REQUEST_PROFILE, RECEIVE_PROFILE
} from './actions'

const projectsInitialState = {

};

const profileInitialState = {

};

function projects(state = projectsInitialState, action) {
    switch (action.type) {
        case REQUEST_PROJECTS:
            return {...state,
                isFetching: true

            };
        case RECEIVE_PROJECTS:
            return {...state,
                isFetching: false,
                items: action.projects
                
            };
        default:
            return state
    }
}

function profile(state = profileInitialState, action) {
    switch (action.type) {
        case REQUEST_PROFILE:
            return {...state,
                isFetching: true

            };
        case RECEIVE_PROFILE:
            return {...state,
                isFetching: false,
                profileContent: action.profile
            };
        default:
            return state
    }
}

const profilePage = combineReducers({
    projects,
    profile
});

export default profilePage