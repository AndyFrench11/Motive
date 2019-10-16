import axios from "axios";

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_FAILURE';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export const RESET_AUTH = 'RESET_AUTH';
export const USER_LOGOUT = 'USER_LOGOUT';

const serverURL = process.env.REACT_APP_BACKEND_ADDRESS;

export function login(valuesJson) {
    return dispatch => {
        dispatch(requestLogin());

        let login = {
            email: valuesJson.email,
            password: valuesJson.password
        };

        return axios.post(serverURL + "/login", login, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
            .then(response => {
                dispatch(receiveLoginSuccess(response))
            })
            .catch(error => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    dispatch(receiveLoginError(error));
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
            });
    }
}


export function logout() {
    return dispatch => {

        // Will be taken by the root reducer
        dispatch({
            type: USER_LOGOUT,
        });


        // Attempt to tell backend to log out session (and invalidate our HttpOnly cookie)
        return axios.delete(serverURL + "/login", {
            withCredentials: true
        })
    }
}

export function resetAuthState() {
    return dispatch => {
        dispatch({
            type: RESET_AUTH,
        })
    }
}

// LOGIN ACTIONS
function requestLogin() {
    return {
        type: LOGIN_REQUEST,
    }
}

// Only on HTTP 2xx reply
function receiveLoginSuccess(response) {
    return {
        type: LOGIN_SUCCESS,
        receivedUser: response.data,
        receivedAt: Date.now()
    }
}

function receiveLoginError(error) {
    return {
        type: LOGIN_FAILURE,
        receivedError: error.response,
        receivedAt: Date.now()
    }
}

