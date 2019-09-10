import {combineReducers} from 'redux'
import {LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT} from "./actions";

const initialState = {
    isAuthenticating: false,
    currentUser: null,
    statusCode: -1,
    lastUpdated: -1,
    isLoggedIn: false,
    complete: false,
    error: false
};

function authController(state = initialState, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {...state,
                isAuthenticating: true,
                complete: false,
                error: false
            };
        case LOGIN_FAILURE:
            console.log(action);
            return {...state,
                isAuthenticating: false,
                statusCode: action.statusCode,
                lastUpdated: action.receivedAt,
                complete: true,
                isLoggedIn: false,
                error: true
            };
        case LOGIN_SUCCESS:
            return {
                isAuthenticating: false,
                currentUser: action.user,
                statusCode: action.statusCode,
                lastUpdated: action.receivedAt,
                complete: true,
                isLoggedIn: true,
                error: false
            };
        case LOGOUT:
            return {
                isAuthenticating: false,
                currentUser: null,
                lastUpdated: action.receivedAt,
                complete: true,
                isLoggedIn: false,
                error: false
            };
        default:
            return state
    }
}

const authReducer = combineReducers({
    authController
});

export default authReducer