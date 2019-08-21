import {combineReducers} from 'redux'
import {
    REQUEST_SIGN_UP,
    RECEIVE_SIGN_UP_RESPONSE
} from './actions'


const signUpInitialState = {
    isPosting: false,
    result: ""
};

function signUpController(state = signUpInitialState, action) {
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

const signUpReducer = combineReducers({
    signUpController
});

export default signUpReducer