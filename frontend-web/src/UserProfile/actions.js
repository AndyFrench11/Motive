import fetch from 'cross-fetch'

export const REQUEST_PROJECTS = 'REQUEST_PROJECTS';
function requestProjects() {
    return {
        type: REQUEST_PROJECTS
    }
}

export const RECEIVE_PROJECTS = 'RECEIVE_PROJECTS';
function receiveProjects(json) {
    console.log(json);
    return {
        type: RECEIVE_PROJECTS,
        //projects: json.data.children.map(child => child.data),
        receivedAt: Date.now()
    }
}

export function fetchProjects() {
    return function(dispatch) {
        dispatch(requestProjects());
        return fetch('https://localhost:8081/api/profile')
            .then(
                response => response.json(),
                error => console.log("An error has occured", error)
            )
            .then(
                json => dispatch(receiveProjects(json))
            )
    }
}