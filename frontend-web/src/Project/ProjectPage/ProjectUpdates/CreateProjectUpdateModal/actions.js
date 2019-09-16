import axios from 'axios/index'

export const REQUEST_NEW_PROJECT_UPDATE = 'REQUEST_NEW_PROJECT_UPDATE';
export const RECEIVE_NEW_PROJECT_UPDATE_RESPONSE = 'RECEIVE_NEW_PROJECT_UPDATE_RESPONSE';

const serverUrl = process.env.REACT_APP_BACKEND_ADDRESS;

function requestNewProjectUpdate() {
    return {
        type: REQUEST_NEW_PROJECT_UPDATE,
    }
}

export function postProjectUpdate(projectGuid, update) {
    return dispatch => {
        dispatch(requestNewProjectUpdate());
        //Take only the values needed for the request

        return axios.post(serverUrl + `/update`, update, {headers: {
                'Content-Type': 'application/json',
                'projectId': projectGuid
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

function receiveNewProjectUpdateResponse(response) {
    if(response.status === 201) {
        return {
            type: RECEIVE_NEW_PROJECT_UPDATE_RESPONSE,
            result: response.data,
            receivedAt: Date.now()
        }
    } else if(response.status === 500) {
        return {
            type: RECEIVE_NEW_PROJECT_UPDATE_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    }
}