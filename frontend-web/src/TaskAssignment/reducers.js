import {combineReducers} from 'redux'
import {
    REQUEST_GET_TASK_ASSIGNEE,
    RECEIVE_GET_TASK_ASSIGNEE,
    REQUEST_UPDATE_TASK_ASSIGNEE,
    RECEIVE_UPDATE_TASK_ASSIGNEE,
    REQUEST_DELETE_TASK_ASSIGNEE,
    RECEIVE_DELETE_TASK_ASSIGNEE
} from './actions'

function assigneeController(state = {}, action) {
    switch (action.type) {
        case REQUEST_GET_TASK_ASSIGNEE:
            return state;
        case RECEIVE_GET_TASK_ASSIGNEE:
            return {
                ...state,
                assignee: action.assignee
            };
        case REQUEST_UPDATE_TASK_ASSIGNEE:
            return state;
        case RECEIVE_UPDATE_TASK_ASSIGNEE:
            return state;
        case REQUEST_DELETE_TASK_ASSIGNEE:
            return state;
        case RECEIVE_DELETE_TASK_ASSIGNEE:
            return state;
        default:
            return state;
    }
}

const taskAssigneeReducer = combineReducers({
    assigneeController
});

export default taskAssigneeReducer