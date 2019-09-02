import {combineReducers} from 'redux'
import {
    REQUEST_LOGIN,
    RECEIVE_LOGIN_RESPONSE, RECEIVE_LOGIN_ERROR
} from './actions'

const loginInitialState = {
    isPosting: false,
    result: "",
    lastUpdated: -1,
    complete: false,
    error: false
};

function loginController(state = loginInitialState, action) {
    switch (action.type) {
        case REQUEST_LOGIN:
            return {...state,
                isPosting: true,
                complete: false,
                error: false
            };
        case RECEIVE_LOGIN_RESPONSE:
            return {...state,
                isPosting: false,
                result: action.result,
                lastUpdated: action.receivedAt,
                complete: true
            };
        case RECEIVE_LOGIN_ERROR:
            return {...state,
                isPosting: false,
                result: action.result.response,
                lastUpdated: action.receivedAt,
                complete: true,
                error: true
            };
        default:
            return state
    }
}

const loginReducer = combineReducers({
    loginController
});

export default loginReducer