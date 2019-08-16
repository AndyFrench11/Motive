import {combineReducers} from 'redux'
import {
    REQUEST_LOGIN,
    RECEIVE_LOGIN_RESPONSE,
    REQUEST_SIGN_UP,
    RECEIVE_SIGN_UP_RESPONSE
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

function signUpController(state = {
    isPosting: false,
    result: ""
}, action) {
    switch (action.type) {
        case REQUEST_SIGN_UP:
            return Object.assign({}, state, {
                isPosting: true,
            });
        case RECEIVE_SIGN_UP_RESPONSE:
            return Object.assign({}, state, {
                isPosting: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}

const landingReducers = combineReducers({
    loginController,
    signUpController
});

export default landingReducers