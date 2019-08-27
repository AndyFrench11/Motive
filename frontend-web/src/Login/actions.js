import axios from "axios";

export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const RECEIVE_LOGIN_RESPONSE = 'RECEIVE_LOGIN_RESPONSE';
export const RECEIVE_LOGIN_ERROR = 'RECEIVE_LOGIN_ERROR';

const serverURL = process.env.REACT_APP_BACKEND_ADDRESS;

export function postLogin(valuesJson) {
    return dispatch => {
        dispatch(requestLogin());
        console.log(valuesJson);
        let login = {
            email: valuesJson.email,
            password: valuesJson.password
        };

        console.log(login);

        return axios.post(serverURL + "/login", login, {headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => dispatch(receiveLoginResponse(response)))
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

function requestLogin() {
    return {
        type: REQUEST_LOGIN,
    }
}
function receiveLoginResponse(response) {
    return {
        type: RECEIVE_LOGIN_RESPONSE,
        result: response,
        receivedAt: Date.now()
    }
}

function receiveLoginError(error) {
    return {
        type: RECEIVE_LOGIN_ERROR,
        result: error,
        receivedAt: Date.now()
    }
}
