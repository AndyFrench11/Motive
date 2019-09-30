import { combineReducers } from 'redux'
import {
    REQUEST_NEW_PROJECT_UPDATE,
    RECEIVE_NEW_PROJECT_UPDATE_RESPONSE, RESET_NEW_PROJECT_STATE
} from './actions'

function createProjectUpdateController(
    state = {
        isUpdating: false,
        result: "",
        createdUpdateGuid: null
    },
    action
) {
    console.log(action);
    switch (action.type) {
        case RESET_NEW_PROJECT_STATE:
            return {
                isUpdating: false,
                result: "",
                createdUpdateGuid: null
            };
        case REQUEST_NEW_PROJECT_UPDATE:
            return Object.assign({}, state, {
                isUpdating: true,
            });
        case RECEIVE_NEW_PROJECT_UPDATE_RESPONSE:
            return Object.assign({}, state, {
                isUpdating: false,
                result: action.result,
                lastUpdated: action.receivedAt,
                createdUpdateGuid: action.createdUpdateGuid
            });
        default:
            return state
    }
}

const createProjectUpdateReducer = combineReducers({
    createProjectUpdateController
});

export default createProjectUpdateReducer