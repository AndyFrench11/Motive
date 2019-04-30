import { combineReducers } from 'redux'
import {
    RECEIVE_LOGIN_RESPONSE,
    REQUEST_LOGIN
} from './actions'

function loginController(state = {
    isPosting: false,
    result: ""
}, action) {
    switch (action.type) {
        case REQUEST_LOGIN:
            return Object.assign({}, state, {
                isPosting: true,
            });
        case RECEIVE_LOGIN_RESPONSE:
            return Object.assign({}, state, {
                isPosting: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}

const loginReducer = combineReducers({
    loginController
});

export default loginReducer