import fetch from 'cross-fetch'
import axios from 'axios'

export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';

export const RECEIVE_NEW_PROJECT_RESPONSE = 'RECEIVE_NEW_PROJECT_RESPONSE';
export const REQUEST_NEW_PROJECT = 'REQUEST_NEW_PROJECT';

export const RECEIVE_LOGIN_RESPONSE = 'RECEIVE_LOGIN_RESPONSE';
export const REQUEST_LOGIN = 'REQUEST_LOGIN';

const localUrl = `http://localhost:8080/api`;
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

        return axios.post(localUrl + "/project", newProject, {headers: {
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
}

function requestNewProject() {
    return {
        type: REQUEST_NEW_PROJECT,
    }
}

function receiveNewProjectResponse(response) {
    if(response.status === 200) {
        return {
            type: RECEIVE_NEW_PROJECT_RESPONSE,
            result: "OK",
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

export function postLogin(valuesJson) {
    return dispatch => {
        dispatch(requestLogin());
        console.log(valuesJson);
        //Take only the values needed for the request
        let login = {
            email: valuesJson.emailInput,
            password: valuesJson.passwordInput
        };

        console.log(login);

        return axios.post(localUrl + "/login", login, {headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => dispatch(receiveLoginResponse(response)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error.response)
            })
    }
}

function requestLogin() {
    return {
        type: REQUEST_LOGIN,
    }
}

function receiveLoginResponse(response) {
    if (response.status === 200) {
        return {
            type: RECEIVE_LOGIN_RESPONSE,
            result: "OK",
            receivedAt: Date.now()
        }
    } else if (response.status === 500) {
        return {
            type: RECEIVE_LOGIN_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    }
}