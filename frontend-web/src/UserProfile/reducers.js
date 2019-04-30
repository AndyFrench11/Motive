import { combineReducers } from 'redux'
import {
    REQUEST_PROJECTS,
    RECEIVE_PROJECTS, REQUEST_PROFILE, RECEIVE_PROFILE
} from './actions'

const projectsInitialState = {
    projects: {
        isFetching: false,
        items: []
    }
};

const profileInitialState = {
    profile: {
        isFetching: false,
        profileContent: null
    }
};

function projects(state = projectsInitialState, action) {
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

function profile(state = profileInitialState, action) {
    switch (action.type) {
        case REQUEST_PROFILE:
            return {...state,
                profile: {
                    isFetching: true
                }
            };
        case RECEIVE_PROFILE:
            return {...state,
                profile : {
                    isFetching: false,
                    profileContent: action.profile
                }
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