import { combineReducers } from 'redux'
import {
    REQUEST_NEW_TASK,
    RECEIVE_NEW_TASK_RESPONSE,
    REQUEST_DELETE_TASK,
    RECEIVE_DELETE_TASK_RESPONSE,
    REQUEST_UPDATE_TASK,
    RECEIVE_UPDATE_TASK_RESPONSE,
    REQUEST_UPDATE_TASK_ORDER,
    RECEIVE_UPDATE_TASK_ORDER_RESPONSE,
} from './actions'

function postTask(
    state = {
        isUpdating: false,
        result: ""
    },
    action
) {
    switch (action.type) {
        case REQUEST_NEW_TASK:
            return Object.assign({}, state, {
                isUpdating: true,
            });
        case RECEIVE_NEW_TASK_RESPONSE:
            return Object.assign({}, state, {
                isUpdating: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}

function updateTask(
    state = {
        isUpdating: false,
        result: ""
    },
    action
) {
    switch (action.type) {
        case REQUEST_UPDATE_TASK:
            return Object.assign({}, state, {
                isUpdating: true,
            });
        case RECEIVE_UPDATE_TASK_RESPONSE:
            return Object.assign({}, state, {
                isUpdating: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}

function updateTaskOrder(
    state = {
        isUpdating: false,
        result: ""
    },
    action
) {
    switch (action.type) {
        case REQUEST_UPDATE_TASK_ORDER:
            return Object.assign({}, state, {
                isUpdating: true,
            });
        case RECEIVE_UPDATE_TASK_ORDER_RESPONSE:
            return Object.assign({}, state, {
                isUpdating: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}

function deleteTask(
    state = {
        isUpdating: false,
        result: ""
    },
    action
) {
    switch (action.type) {
        case REQUEST_DELETE_TASK:
            return Object.assign({}, state, {
                isUpdating: true,
            });
        case RECEIVE_DELETE_TASK_RESPONSE:
            return Object.assign({}, state, {
                isUpdating: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}

function projectTaskController(state = {}, action) {
    switch (action.type) {
        case REQUEST_NEW_TASK:
        case RECEIVE_NEW_TASK_RESPONSE:
            return postTask(state, action);
        case REQUEST_DELETE_TASK:
        case RECEIVE_DELETE_TASK_RESPONSE:
            return deleteTask(state, action);
        case REQUEST_UPDATE_TASK:
        case RECEIVE_UPDATE_TASK_RESPONSE:
            return updateTask(state, action);
        case REQUEST_UPDATE_TASK_ORDER:
        case RECEIVE_UPDATE_TASK_ORDER_RESPONSE:
            return updateTaskOrder(state, action);
        default:
            return state;

    }
}

const projectTaskReducer = combineReducers({
    projectTaskController
});

export default projectTaskReducer