import fetch from 'cross-fetch'
import axios from 'axios'

export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';

export const RECEIVE_NEW_PROJECT_RESPONSE = 'RECEIVE_NEW_PROJECT_RESPONSE';
export const REQUEST_NEW_PROJECT = 'REQUEST_NEW_PROJECT';

const localUrl = `http://localhost:8080/api/project`;
const serverUrl = `http://csse-s402g2.canterbury.ac.nz:8080/api/project`;

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

export function postProject(valuesJson) {
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

        return axios.post(localUrl, newProject, {headers: {
                'Content-Type': 'application/json'
            }
        })
            .catch(error => console.log(error))
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