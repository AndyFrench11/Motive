import axios from "axios";

export const REQUEST_SIGN_UP = 'REQUEST_SIGN_UP';
export const RECEIVE_SIGN_UP_RESPONSE = 'RECEIVE_SIGN_UP_RESPONSE';


const localUrl = `http://localhost:8080/api`;

export function postSignUp(valuesJson) {
    return dispatch => {
        dispatch(requestSignUp());

        let signUp = {
            firstName: valuesJson.firstName,
            lastName: valuesJson.lastName,
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