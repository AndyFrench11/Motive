import axios from 'axios/index'

export const REQUEST_SUB_PROJECTS = 'REQUEST_SUB_PROJECTS';
export const RECEIVE_SUB_PROJECTS = 'RECEIVE_SUB_PROJECTS';
export const REQUEST_NEW_SUBPROJECT = 'REQUEST_NEW_SUBPROJECT';
export const RECEIVE_NEW_SUBPROJECT_RESPONSE = 'RECEIVE_NEW_SUBPROJECT_RESPONSE';

const serverUrl = process.env.REACT_APP_BACKEND_ADDRESS;

function requestSubProjects() {
    return {
        type: REQUEST_SUB_PROJECTS
    }
}

function receiveSubProjects(json) {
    return {
        type: RECEIVE_SUB_PROJECTS,
        subProjects: json
    }
}

export function fetchSubProjects (parentProjectGuid) {
    return function (dispatch) {
        dispatch(requestSubProjects());
        return fetch(serverUrl + `/project/${parentProjectGuid}/subprojects`)
            .then(
                response => response.json(),
                error => console.log("An error has occurred!!", error)
            )
            .then(
                json => dispatch(receiveSubProjects(json))
            )

    }
}

function requestSubProject() {
    return {
        type: REQUEST_NEW_SUBPROJECT,
    }
}

export function postSubProject(parentProjectGuid, subProject) {
    return dispatch => {
        dispatch(requestSubProject());
        //Take only the values needed for the request
        return axios.post(serverUrl + `/project/${parentProjectGuid}/subproject`, subProject, {headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => dispatch(receiveNewProjectUpdateResponse(response, dispatch, parentProjectGuid)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error.response)
            })

    }
}

function receiveNewProjectUpdateResponse(response, dispatch, parentProjectGuid) {
    if(response.status === 201) {
        dispatch(fetchSubProjects(parentProjectGuid))
        return {
            type: RECEIVE_NEW_SUBPROJECT_RESPONSE,
            result: response.data,
            receivedAt: Date.now()
        }
    } else if(response.status === 500) {
        return {
            type: RECEIVE_NEW_SUBPROJECT_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    }
}