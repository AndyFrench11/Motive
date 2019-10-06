import axios from 'axios/index'

export const RESET_NEW_PROJECT_STATE = 'UPDATE_MODAL_RESET_STATE';
export const REQUEST_NEW_PROJECT_UPDATE = 'REQUEST_NEW_PROJECT_UPDATE';
export const RECEIVE_NEW_PROJECT_UPDATE_RESPONSE = 'RECEIVE_NEW_PROJECT_UPDATE_RESPONSE';

const serverUrl = process.env.REACT_APP_BACKEND_ADDRESS;

function requestNewProjectUpdate() {
    return {
        type: REQUEST_NEW_PROJECT_UPDATE,
    }
}

export function postProjectUpdate(projectGuid, userGuid, update) {
    return dispatch => {
        dispatch(requestNewProjectUpdate());
        //Take only the values needed for the request
        return axios.post(serverUrl + `/projectUpdate`, update, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'projectGuid': projectGuid,
                'userGuid': userGuid
            }
        })
            .then(response => dispatch(receiveNewProjectUpdateResponse(response)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error.response)
            })

    }
}

export function resetModalState() {
    return dispatch => {
        dispatch({
            type: RESET_NEW_PROJECT_STATE,
        })
    }
}

function receiveNewProjectUpdateResponse(response) {
    if(response.status === 201) {
        return {
            type: RECEIVE_NEW_PROJECT_UPDATE_RESPONSE,
            result: response.data,
            receivedAt: Date.now(),
            createdUpdateGuid: response.data
        }
    } else if(response.status === 500) {
        return {
            type: RECEIVE_NEW_PROJECT_UPDATE_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now(),
            createdUpdateGuid: null
        }
    }
}