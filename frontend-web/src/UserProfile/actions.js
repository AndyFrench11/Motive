import fetch from 'cross-fetch'

const serverUrl = process.env.REACT_APP_BACKEND_ADDRESS;

export const REQUEST_PROJECTS = 'REQUEST_PROJECTS';
function requestProjects() {
    return {
        type: REQUEST_PROJECTS
    }
}

export const RECEIVE_PROJECTS = 'RECEIVE_PROJECTS';
function receiveProjects(json) {
    return {
        type: RECEIVE_PROJECTS,
        projects: json,
        receivedAt: Date.now()
    }
}

export const REQUEST_PROFILE = 'REQUEST_PROFILE';
function requestProfile() {
    return {
        type: REQUEST_PROFILE
    }
}

export const RECEIVE_PROFILE = 'RECEIVE_PROFILE';
function receiveProfile(json) {
    return {
        type: RECEIVE_PROFILE,
        profile: json,
        receivedAt: Date.now()
    }
}

export function fetchProjects(guid) {
    return function(dispatch) {
        dispatch(requestProjects());
        return fetch(serverUrl + `/project`, {headers: {'userId': guid}})
            .then(
                response => response.json(),
                error => console.log("An error has occurred", error)
            )
            .then(
                json => dispatch(receiveProjects(json))
            )
    }
}

export function fetchProfile (guid) {
    return function (dispatch) {
        dispatch(requestProfile());
        return fetch(serverUrl + `/person/${guid}`)
            .then(
                response => response.json(),
                error => console.log("An error has occurred!!", error)
            )
            .then(
                json => dispatch(receiveProfile(json))
            )

    }
}