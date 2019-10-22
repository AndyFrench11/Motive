import axios from 'axios/index'

export const REQUEST_DELETE_PROJECT = 'REQUEST_DELETE_PROJECT';
export const RECEIVE_DELETE_PROJECT_RESPONSE = 'RECEIVE_DELETE_PROJECT_RESPONSE';

const serverUrl = process.env.REACT_APP_BACKEND_ADDRESS;

function requestDeleteProject() {
    return {
        type: REQUEST_DELETE_PROJECT,
    }
}

export function deleteProject(projectGuid) {
    return dispatch => {
        dispatch(requestDeleteProject());
    
        return axios.delete(serverUrl + "/project/" + projectGuid, {
            withCredentials: true,
        })
            .then(response => dispatch(receiveDeleteProjectResponse(response)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error.response)
            })

    }
}

function receiveDeleteProjectResponse(response) {
    if(response.status === 200) {
        return {
            type: RECEIVE_DELETE_PROJECT_RESPONSE,
            result: response.data,
            receivedAt: Date.now()
        }
    } else if(response.status === 500) {
        return {
            type: RECEIVE_DELETE_PROJECT_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    }
}