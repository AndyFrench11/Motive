import {combineReducers} from 'redux'
import {
    REQUEST_GET_TASK_STATUS,
    RECEIVE_GET_TASK_STATUS,
    REQUEST_UPDATE_TASK_STATUS,
    RECEIVE_UPDATE_TASK_STATUS,
    REQUEST_DELETE_TASK_STATUS,
    RECEIVE_DELETE_TASK_STATUS
} from './actions'

function statusController(state = {}, action) {
    switch (action.type) {
        case REQUEST_GET_TASK_STATUS:
            return state;
        case RECEIVE_GET_TASK_STATUS:
            return {
                ...state,
                status: action.status
            };
        case REQUEST_UPDATE_TASK_STATUS:
            return state;
        case RECEIVE_UPDATE_TASK_STATUS:
            return state;
        case REQUEST_DELETE_TASK_STATUS:
            return state;
        case RECEIVE_DELETE_TASK_STATUS:
            return state;
        default:
            return state;
    }
}

const taskStatusReducer = combineReducers({
    statusController
});

export default taskStatusReducer