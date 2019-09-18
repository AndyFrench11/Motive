import axios from 'axios/index'

export const REQUEST_PROJECT_UPDATES_FOR_USER = 'REQUEST_PROJECT_UPDATES_FOR_USER';
export const RECEIVE_PROJECT_UPDATES_FOR_USER_RESPONSE = 'RECEIVE_PROJECT_UPDATES_FOR_USER_RESPONSE';

const serverUrl = process.env.REACT_APP_BACKEND_ADDRESS;

function requestProjectUpdatesForUser() {
    return {
        type: REQUEST_PROJECT_UPDATES_FOR_USER
    }
}

export function fetchProjectUpdatesForUser (userGuid) {
    return function (dispatch) {
        dispatch(requestProjectUpdatesForUser());
        return axios.get(serverUrl + `/projectUpdate/${userGuid}/user`)
            .then(response => dispatch(receiveProjectUpdatesForUser(response)))
            .catch(error => {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error)
            })

    }
}

function receiveProjectUpdatesForUser(response) {
    if(response.status === 200) {
        return {
            type: RECEIVE_PROJECT_UPDATES_FOR_USER_RESPONSE,
            result: response.data,
            receivedAt: Date.now()
        }
    } else if(response.status === 500) {
        return {
            type: RECEIVE_PROJECT_UPDATES_FOR_USER_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    }
}