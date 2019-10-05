import {combineReducers} from 'redux'
import {
    REQUEST_GET_TASK_PRIORITY,
    RECEIVE_GET_TASK_PRIORITY,
    REQUEST_UPDATE_TASK_PRIORITY,
    RECEIVE_UPDATE_TASK_PRIORITY,
    REQUEST_DELETE_TASK_PRIORITY,
    RECEIVE_DELETE_TASK_PRIORITY
} from './actions'

function priorityController(state = {}, action) {
    switch (action.type) {
        case REQUEST_GET_TASK_PRIORITY:
            return state;
        case RECEIVE_GET_TASK_PRIORITY:
            return {
                ...state,
                priority: action.priority
            };
        case REQUEST_UPDATE_TASK_PRIORITY:
            return state;
        case RECEIVE_UPDATE_TASK_PRIORITY:
            return state;
        case REQUEST_DELETE_TASK_PRIORITY:
            return state;
        case RECEIVE_DELETE_TASK_PRIORITY:
            return state;
        default:
            return state;
    }
}

const taskPriorityReducer = combineReducers({
    priorityController
});

export default taskPriorityReducer