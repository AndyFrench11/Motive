import axios from "axios";

export const REQUEST_SIGN_UP = 'REQUEST_SIGN_UP';
export const RECEIVE_SIGN_UP_RESPONSE = 'RECEIVE_SIGN_UP_RESPONSE';
export const RECEIVE_SIGN_UP_ERROR = 'RECEIVE_SIGN_UP_ERROR';

const serverURL = process.env.REACT_APP_BACKEND_ADDRESS;

export function postSignUp(valuesJson) {
    return dispatch => {
        dispatch(requestSignUp());

        let signUpJson = {
            firstName: valuesJson.firstName,
            lastName: valuesJson.lastName,
            email: valuesJson.email,
            password: valuesJson.password,
            dateOfBirth: valuesJson.birthday
        };

        return axios.post(serverURL + "/signup", signUpJson, {headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => dispatch(receiveSignUpResponse(response)))
            .catch(error => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    dispatch(receiveSignUpError(error))
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

function requestSignUp() {
    return {
        type: REQUEST_SIGN_UP,
    }
}

function receiveSignUpResponse(response) {
    console.log("HERRRREEEE");
    return {
        type: RECEIVE_SIGN_UP_RESPONSE,
        result: response,
        receivedAt: Date.now()
    }
}

function receiveSignUpError(error) {
    console.log("HERRRREEEE?!");
    return {
        type: RECEIVE_SIGN_UP_ERROR,
        result: error,
        receivedAt: Date.now()
    }
}