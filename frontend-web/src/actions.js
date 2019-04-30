import fetch from 'cross-fetch'
import axios from 'axios'

export const REQUEST_SINGLE_PROJECT = 'REQUEST_PROJECT';
export const RECEIVE_SINGLE_PROJECT = 'RECEIVE_PROJECT';

export const RECEIVE_NEW_PROJECT_RESPONSE = 'RECEIVE_NEW_PROJECT_RESPONSE';
export const REQUEST_NEW_PROJECT = 'REQUEST_NEW_PROJECT';

const localUrl = `http://localhost:8080/api`;
const serverUrl = `http://csse-s402g2.canterbury.ac.nz:8080/api/project`;

function requestSingleProject() {
    return {
        type: REQUEST_SINGLE_PROJECT,
    }
}

function receiveSingleProject(json) {
    return {
        type: RECEIVE_SINGLE_PROJECT,
        result: json.data,
        receivedAt: Date.now()
    }
}

export function fetchProject(projectId, personGuid) {
    return dispatch => {
        dispatch(requestSingleProject());
        return axios.get(localUrl + "/person/" + personGuid + "/project/" + projectId)
            .then(response => dispatch(receiveSingleProject(response)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error)
            })
    }
}

export function postProject(guid, valuesJson) {
    return dispatch => {
        dispatch(requestNewProject());
        console.log(valuesJson);
        //Take only the values needed for the request
        let newProject = {
            name: valuesJson.projectNameInput,
            description: valuesJson.descriptionInput,
            taskList: valuesJson.taskList,
            tagList: valuesJson.tags
        };

        console.log(newProject);
        console.log(guid);
        return axios.post(localUrl + "/person/" + guid + "/project", newProject, {headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => dispatch(receiveNewProjectResponse(response)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error.response)
            })

    }
};

function requestNewProject() {
    return {
        type: REQUEST_NEW_PROJECT,
    }
};

function receiveNewProjectResponse(response) {
    if(response.status === 201) {
        return {
            type: RECEIVE_NEW_PROJECT_RESPONSE,
            result: response.data,
            receivedAt: Date.now()
        }
    } else if(response.status === 500) {
        return {
            type: RECEIVE_NEW_PROJECT_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    }

};

//UPDATE UI
function updateCurrentProject() {

}