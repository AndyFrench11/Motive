import {combineReducers} from 'redux'
import {
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT_REQUEST,
    LOGOUT_FAILURE,
    LOGOUT_SUCCESS, RESET_AUTH,
} from "./actions";

const initialState = {
    isLoggingIn: false,
    currentUser: null,
    loginError: false,

    isLoggingOut: false,
    logoutError: false,

    lastUpdated: -1
};

function authController(state = initialState, action) {
    switch (action.type) {
        case RESET_AUTH:
            return initialState;

        case LOGIN_REQUEST:
            return {
                isLoggingIn: true,
                currentUser: null,
                loginError: false,

                isLoggingOut: false,
                logoutError: false,

                lastUpdated: -1
            };

        case LOGIN_SUCCESS:
            return {...state,
                isLoggingIn: false,
                currentUser: action.receivedUser,
                loginError: false,

                lastUpdated: action.receivedAt
            };


        case LOGIN_FAILURE:
            return {...state,
                isLoggingIn: false,
                currentUser: null,
                loginError: action.receivedError,

                lastUpdated: action.receivedAt
            };


        case LOGOUT_REQUEST:
            return {...state,
                isLoggingOut: true,
                logoutError: false,

                lastUpdated: action.receivedAt
            };

        default:
            return state
    }
}

const authReducer = combineReducers({
    authController
});

export default authReducer