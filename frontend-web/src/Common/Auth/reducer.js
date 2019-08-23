import {combineReducers} from 'redux'
import jwtDecode from 'jwt-decode'
import {LOGIN_FAILURE, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT} from "./actions";

const initialState = (token => ({
    isAuthenticating: false,
    currentUser: token ? jwtDecode(token) : null,
    statusCode: -1,
    lastUpdated: -1,
    complete: false,
    error: false
}))(localStorage.authToken);

function authController(state = initialState, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {...state,
                isAuthenticating: true,
                complete: false,
                error: false
            };
        case LOGIN_FAILURE:
            return {...state,
                isAuthenticating: false,
                statusCode: action.statusCode,
                lastUpdated: action.receivedAt,
                complete: true,
                error: true
            };
        case LOGIN_SUCCESS:
            return {
                isAuthenticating: false,
                currentUser: action.user,
                statusCode: action.statusCode,
                lastUpdated: action.receivedAt,
                complete: true,
                error: false
            };
        case LOGOUT:
            return {
                isAuthenticating: false,
                currentUser: null,
                lastUpdated: action.receivedAt,
                complete: true,
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