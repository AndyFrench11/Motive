import { combineReducers } from 'redux'
import {
    REQUEST_UPDATE_PROJECT_NAME,
    RECEIVE_UPDATE_PROJECT_NAME_RESPONSE,
    REQUEST_UPDATE_PROJECT_DESCRIPTION,
    RECEIVE_UPDATE_PROJECT_DESCRIPTION_RESPONSE,
    REQUEST_UPDATE_PROJECT_IMAGE_INDEX,
    RECEIVE_UPDATE_PROJECT_IMAGE_INDEX_RESPONSE,
    REQUEST_DELETE_PROJECT,
    RECEIVE_DELETE_PROJECT_RESPONSE,
    REQUEST_NEW_TAG,
    RECEIVE_NEW_TAG_RESPONSE,
    REQUEST_REMOVE_TAG,
    RECEIVE_REMOVE_TAG_RESPONSE
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

function addTag(
    state = {
        isUpdating: false,
        result: ""
    },
    action
) {
    switch (action.type) {
        case REQUEST_NEW_TAG:
            return Object.assign({}, state, {
                isUpdating: true,
            });
        case RECEIVE_NEW_TAG_RESPONSE:
            return Object.assign({}, state, {
                isUpdating: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}

function removeTag(
    state = {
        isUpdating: false,
        result: ""
    },
    action
) {
    switch (action.type) {
        case REQUEST_REMOVE_TAG:
            return Object.assign({}, state, {
                isUpdating: true,
            });
        case RECEIVE_REMOVE_TAG_RESPONSE:
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
        case REQUEST_NEW_TAG:
        case RECEIVE_NEW_TAG_RESPONSE:
            addTag(state, action)
        case REQUEST_REMOVE_TAG:
        case RECEIVE_REMOVE_TAG_RESPONSE:
            removeTag(state, action)
        default:
            return state;

    }
}

const projectDetailsReducer = combineReducers({
    projectDetailsController
});

export default projectDetailsReducer