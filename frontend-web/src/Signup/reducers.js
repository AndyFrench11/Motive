import {combineReducers} from 'redux'
import {
    REQUEST_SIGN_UP,
    RECEIVE_SIGN_UP_RESPONSE, RECEIVE_SIGN_UP_ERROR
} from './actions'

const signUpInitialState = {
    isPosting: false,
    result: "",
    lastUpdated: -1,
    complete: false,
    error: false
};

function signUpController(state = signUpInitialState, action) {
    switch (action.type) {
        case REQUEST_SIGN_UP:
            return {...state,
                isPosting: true,
                complete: false
            };
        case RECEIVE_SIGN_UP_RESPONSE:
            return {...state,
                isPosting: false,
                result: action.result,
                lastUpdated: action.receivedAt,
                complete: true
            };
        case RECEIVE_SIGN_UP_ERROR:
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

const signUpReducer = combineReducers({
    signUpController
});

export default signUpReducer