import axios from 'axios/index'
import { fetchProjects } from './../UserProfile/actions'

export const REQUEST_SINGLE_PROJECT = 'REQUEST_PROJECT';
export const RECEIVE_SINGLE_PROJECT = 'RECEIVE_PROJECT';

export const RECEIVE_NEW_PROJECT_RESPONSE = 'RECEIVE_NEW_PROJECT_RESPONSE';
export const REQUEST_NEW_PROJECT = 'REQUEST_NEW_PROJECT';


export const REQUEST_PROJECT_PROFILES = 'REQUEST_PROJECT_PROFILES';
export const RECEIVE_PROJECT_PROFILES = 'RECEIVE_PROJECT_PROFILES';

const serverUrl = process.env.REACT_APP_BACKEND_ADDRESS;

function requestSingleProject() {
    return {
        type: REQUEST_SINGLE_PROJECT,
    }
}

export function fetchProject(projectId) {
    return dispatch => {
        dispatch(requestSingleProject());
        return axios.get(serverUrl + "/project/" + projectId, {withCredentials: true,})
            .then(response => dispatch(receiveSingleProject(response)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error)
            })
    }
}

function receiveSingleProject(json) {
    return {
        type: RECEIVE_SINGLE_PROJECT,
        result: json.data,
        receivedAt: Date.now()
    }
}

export function postProject(userGuid, newProject) {
    return dispatch => {
        dispatch(requestNewProject());
        //Take only the values needed for the request

        return axios.post(serverUrl + "/project", newProject, {headers: {
                'Content-Type': 'application/json',
                'userId': userGuid
            },
            withCredentials: true
        })
            .then(response => dispatch(receiveNewProjectResponse(response, dispatch, userGuid)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error.response)
            })

    }
}

function requestNewProject() {
    return {
        type: REQUEST_NEW_PROJECT,
    }
}

function receiveNewProjectResponse(response, dispatch, userGuid) {
    if(response.status === 201) {
        dispatch(fetchProjects(userGuid))
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
}

function requestProjectProfiles() {
    return {
        type: REQUEST_PROJECT_PROFILES
    }
}

function receiveProjectProfiles(json) {
    return {
        type: RECEIVE_PROJECT_PROFILES,
        owners: json
    }
}

export function fetchProjectProfiles (guid) {
    return function (dispatch) {
        dispatch(requestProjectProfiles());
        return fetch(serverUrl + `/project/${guid}/owners`)
            .then(
                response => response.json(),
                error => console.log("An error has occurred!!", error)
            )
            .then(
                json => dispatch(receiveProjectProfiles(json))
            )

    }
}

