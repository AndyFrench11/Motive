import axios from "axios";
import jwtDecode from 'jwt-decode'

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

const serverURL = process.env.REACT_APP_BACKEND_ADDRESS;

export function login(valuesJson) {
    return dispatch => {
        dispatch(requestLogin());

        let login = {
            email: valuesJson.email,
            password: valuesJson.password
        };

        return axios.post(serverURL + "/login", login, {headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                localStorage.authToken = response.data;
                console.log(jwtDecode(response.data));
                dispatch(receiveLoginSuccess(response))
            })
            .catch(error => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    dispatch(receiveLoginError(error))
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
    delete localStorage.authToken;
    return {
        type: LOGOUT
    }
}

function requestLogin() {
    return {
        type: LOGIN_REQUEST,
    }
}
function receiveLoginSuccess(response) {
    return {
        type: LOGIN_SUCCESS,
        user: jwtDecode(response.data),
        statusCode: response.status,
        receivedAt: Date.now()
    }
}

function receiveLoginError(error) {
    return {
        type: LOGIN_FAILURE,
        statusCode: error.response.status,
        receivedAt: Date.now()
    }
}