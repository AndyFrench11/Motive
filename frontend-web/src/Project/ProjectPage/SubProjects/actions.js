import axios from 'axios/index'

export const REQUEST_SUB_PROJECTS = 'REQUEST_SUB_PROJECTS';
export const RECEIVE_SUB_PROJECTS = 'RECEIVE_SUB_PROJECTS';

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