import axios from "axios";

export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const RECEIVE_LOGIN_RESPONSE = 'RECEIVE_LOGIN_RESPONSE';

export const REQUEST_SIGN_UP = 'REQUEST_SIGN_UP';
export const RECEIVE_SIGN_UP_RESPONSE = 'RECEIVE_SIGN_UP_RESPONSE';


const localUrl = `http://localhost:8080/api`;

export function postLogin(valuesJson) {
    return dispatch => {
        dispatch(requestLogin());
        console.log(valuesJson);
        let login = {
            email: valuesJson.email,
            password: valuesJson.password
        };

        console.log(login);

        return axios.post(localUrl + "/login", login, {headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => dispatch(receiveLoginResponse(response)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error.response)
            })
    }
}

function requestLogin() {
    return {
        type: REQUEST_LOGIN,
    }
}

function receiveLoginResponse(response) {
    if (response.status === 200) {
        return {
            type: RECEIVE_LOGIN_RESPONSE,
            result: "OK",
            receivedAt: Date.now()
        }
    } else if (response.status === 500) {
        return {
            type: RECEIVE_LOGIN_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    }
}

export function postSignUp(valuesJson) {
    return dispatch => {
        dispatch(requestSignUp());
        console.log(valuesJson);
        let signUp = {
            name: valuesJson.name,
            email: valuesJson.email,
            password: valuesJson.password,
            birthday: valuesJson.birthday
        };

        console.log(signUp);

        return axios.post(localUrl + "/signUp", signUp, {headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => dispatch(receiveSignUpResponse(response)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error.response)
            })
    }
}

function requestSignUp() {
    return {
        type: REQUEST_SIGN_UP,
    }
}

function receiveSignUpResponse(response) {
    if (response.status === 200) {
        return {
            type: RECEIVE_SIGN_UP_RESPONSE,
            result: "OK",
            receivedAt: Date.now()
        }
    } else if (response.status === 500) {
        return {
            type: RECEIVE_SIGN_UP_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    }
}