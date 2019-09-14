import { combineReducers } from 'redux'
import {
    REQUEST_SINGLE_PROJECT,
    RECEIVE_SINGLE_PROJECT,
    RECEIVE_NEW_PROJECT_RESPONSE,
    REQUEST_NEW_PROJECT,
    REQUEST_PROJECT_PROFILES, 
    RECEIVE_PROJECT_PROFILES
} from './actions'
import {reducer as formReducer} from "redux-form";
import profilePage from "../UserProfile/reducers";
import signUpReducer from "../Signup/reducers";
import loginReducer from "../Login/reducers";
import authReducer from "../Common/Auth/reducer";
import projectTaskReducer from "./ProjectPage/ProjectTasks/reducers";
import projectDetailsReducer from "./ProjectPage/ProjectDetails/reducers";
import projectSettingsReducer from "./ProjectPage/ProjectSettings/reducers";

function newProject(
    state = {
        isSigningIn: false,
        result: ""
    },
    action
) {
    switch (action.type) {
        case REQUEST_NEW_PROJECT:
            return Object.assign({}, state, {
                isSigningIn: true,
            });
        case RECEIVE_NEW_PROJECT_RESPONSE:
            return Object.assign({}, state, {
                isSigningIn: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}

function createProjectController(state = {}, action) {
    switch (action.type) {
        case REQUEST_NEW_PROJECT:
        case RECEIVE_NEW_PROJECT_RESPONSE:
            return newProject(state, action);
        default:
            return state
    }
}

function retrieveProject(
    state = {
        isRetrieving: false,
        result: ""
    },
    action
) {
    switch (action.type) {
        case REQUEST_SINGLE_PROJECT:
            return Object.assign({}, state, {
                isRetrieving: true,
            });
        case RECEIVE_SINGLE_PROJECT:
            return Object.assign({}, state, {
                isRetrieving: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}

function projectController(state = {}, action) {
    switch (action.type) {
        case RECEIVE_SINGLE_PROJECT:
        case REQUEST_SINGLE_PROJECT:
            return retrieveProject(state, action);
        default:
            return state
    }
}

function projectOwnersController(state = {}, action) {
    switch (action.type) {
        case REQUEST_PROJECT_PROFILES:
            return {...state,
                isRetrievingOwners: true
            };
        case RECEIVE_PROJECT_PROFILES:
            return {...state,
                isRetrievingOwners: false,
                owners: action.owners
            };
        default:
            return state
    }
}

const rootReducer = combineReducers({
    form: formReducer,
    createProjectController,
    authReducer,
    loginReducer,
    signUpReducer,
    profilePage,
    projectController,
    projectTaskReducer,
    projectOwnersController,
    projectDetailsReducer,
    projectSettingsReducer
});

export default rootReducer