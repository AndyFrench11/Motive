import { combineReducers } from 'redux'
import {
    REQUEST_UPDATE_PROJECT_NAME,
    RECEIVE_UPDATE_PROJECT_NAME_RESPONSE,
    REQUEST_UPDATE_PROJECT_DESCRIPTION,
    RECEIVE_UPDATE_PROJECT_DESCRIPTION_RESPONSE,
    REQUEST_UPDATE_PROJECT_IMAGE_INDEX,
    RECEIVE_UPDATE_PROJECT_IMAGE_INDEX_RESPONSE,
    REQUEST_DELETE_PROJECT,
    RECEIVE_DELETE_PROJECT_RESPONSE
} from './actions'

function updateProjectName(
    state = {
        isUpdating: false,
        result: ""
    },
    action
) {
    switch (action.type) {
        case REQUEST_UPDATE_PROJECT_NAME:
            return Object.assign({}, state, {
                isUpdating: true,
            });
        case RECEIVE_UPDATE_PROJECT_NAME_RESPONSE:
            return Object.assign({}, state, {
                isUpdating: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}

function updateProjectDescription(
    state = {
        isUpdating: false,
        result: ""
    },
    action
) {
    switch (action.type) {
        case REQUEST_UPDATE_PROJECT_DESCRIPTION:
            return Object.assign({}, state, {
                isUpdating: true,
            });
        case RECEIVE_UPDATE_PROJECT_DESCRIPTION_RESPONSE:
            return Object.assign({}, state, {
                isUpdating: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}

function updateProjectImageIndex(
    state = {
        isUpdating: false,
        result: ""
    },
    action
) {
    switch (action.type) {
        case REQUEST_UPDATE_PROJECT_IMAGE_INDEX:
            return Object.assign({}, state, {
                isUpdating: true,
            });
        case RECEIVE_UPDATE_PROJECT_IMAGE_INDEX_RESPONSE:
            return Object.assign({}, state, {
                isUpdating: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}

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


function projectDetailsController(state = {}, action) {
    switch (action.type) {
        case REQUEST_UPDATE_PROJECT_NAME:
        case RECEIVE_UPDATE_PROJECT_NAME_RESPONSE:
            updateProjectName(state, action)
        case REQUEST_UPDATE_PROJECT_DESCRIPTION:
        case RECEIVE_UPDATE_PROJECT_DESCRIPTION_RESPONSE:
            updateProjectDescription(state, action)
        case REQUEST_UPDATE_PROJECT_IMAGE_INDEX:
        case RECEIVE_UPDATE_PROJECT_IMAGE_INDEX_RESPONSE:
            updateProjectImageIndex(state, action)
        case REQUEST_DELETE_PROJECT:
        case RECEIVE_DELETE_PROJECT_RESPONSE:
            deleteProject(state, action)
        default:
            return state;

    }
}

const projectDetailsReducer = combineReducers({
    projectDetailsController
});

export default projectDetailsReducer