import fetch from 'cross-fetch'
import axios from 'axios'

export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';

export const RECEIVE_PROJECT = 'RECEIVE_PROJECT';
export const RECEIVE_NEW_PROJECT_RESPONSE = 'RECEIVE_NEW_PROJECT_RESPONSE';
export const REQUEST_NEW_PROJECT = 'REQUEST_NEW_PROJECT';

function requestPosts() {
    return {
        type: REQUEST_POSTS,
    }
}

function receivePosts(json) {
    return {
        type: RECEIVE_POSTS,
        result: json.data,
        receivedAt: Date.now()
    }
}

export function fetchPosts() {
    return dispatch => {
        dispatch(requestPosts());
        return fetch(`https://www.reddit.com/r/nbastreams.json`)
            .then(response => response.json())
            .then(json => dispatch(receivePosts(json)))
    }
}

export function postProject(json) {
    return dispatch => {
        dispatch(requestNewProject());
        console.log(json);
        return axios.post(`http://csse-s402g2.canterbury.ac.nz:8080/api/project`, json)
            .then(response => dispatch(receiveNewProjectResponse(response)))
    }
};

function requestNewProject() {
    return {
        type: REQUEST_NEW_PROJECT,
    }
};

function receiveNewProjectResponse(response) {
    return {
        type: RECEIVE_NEW_PROJECT_RESPONSE,
        result: response.data,
        receivedAt: Date.now()
    }
};