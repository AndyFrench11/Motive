import {combineReducers} from 'redux'
import {
    REQUEST_SIGN_UP,
    RECEIVE_SIGN_UP_RESPONSE, RECEIVE_SIGN_UP_ERROR
} from './actions'

const signUpInitialState = {
    isPosting: false,
    result: "",
    lastUpdated: -1,
    error: false
};

function signUpController(state = signUpInitialState, action) {
    switch (action.type) {
        case REQUEST_SIGN_UP:
            return {...state,
                isSigningIn: true,
            };
        case RECEIVE_SIGN_UP_RESPONSE:
            return {...state,
                isSigningIn: false,
                result: action.result,
                lastUpdated: action.receivedAt
            };
        case RECEIVE_SIGN_UP_ERROR:
            return {...state,
                isSigningIn: false,
                result: action.result,
                lastUpdated: action.receivedAt,
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