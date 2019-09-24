import { combineReducers } from 'redux'
import {
    REQUEST_PROJECT_UPDATES_FOR_USER,
    RECEIVE_PROJECT_UPDATES_FOR_USER_RESPONSE
} from './actions'

function homeController(state = {}, action) {
    switch (action.type) {
        case REQUEST_PROJECT_UPDATES_FOR_USER:
            return {...state,
                isUpdating: true,
            };
        case RECEIVE_PROJECT_UPDATES_FOR_USER_RESPONSE:
            return {...state,
                isUpdating: false,
                result: action.result,
                lastUpdated: action.receivedAt
            };
        default:
            return state;
    }
}

const homeReducer = combineReducers({
    homeController
});

export default homeReducer