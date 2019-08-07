import fetch from 'cross-fetch'

const localUrl = `http://localhost:8080/api`;
const serverUrl = `http://csse-s402g2.canterbury.ac.nz:8080/api`;

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

export const REQUEST_PROFILE = 'REQUEST_PROFILE';
function requestProfile() {
    return {
        type: REQUEST_PROFILE
    }
}

export const RECEIVE_PROFILE = 'RECEIVE_PROFILE';
function receiveProfile(json) {
    console.log(json);
    return {
        type: RECEIVE_PROFILE,
        profile: json,
        receivedAt: Date.now()
    }
}

export function fetchProjects() {
    return function(dispatch) {
        dispatch(requestProjects());
        return fetch(serverUrl + '/person')
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