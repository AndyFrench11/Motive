import axios from 'axios/index';

const OK = 200;
export const REQUEST_GET_TASK_PRIORITY = 'REQUEST_GET_TASK_PRIORITY';
export const RECEIVE_GET_TASK_PRIORITY = 'RECEIVE_GET_TASK_PRIORITY';
export const REQUEST_UPDATE_TASK_PRIORITY = 'REQUEST_UPDATE_TASK_PRIORITY';
export const RECEIVE_UPDATE_TASK_PRIORITY = 'RECEIVE_UPDATE_TASK_PRIORITY';
export const REQUEST_DELETE_TASK_PRIORITY = 'REQUEST_DELETE_TASK_PRIORITY';
export const RECEIVE_DELETE_TASK_PRIORITY = 'RECEIVE_DELETE_TASK_PRIORITY';

const serverUrl = process.env.REACT_APP_BACKEND_ADDRESS;
function requestGetPriority() {
    return {
        type: REQUEST_GET_TASK_PRIORITY
    }
}

export function getPriority(userGuid, taskGuid) {
    return function (dispatch) {
        dispatch(requestGetPriority());
        return fetch(serverUrl + '/taskpriority/' + taskGuid, {
            headers: {
                'userId': userGuid
            }
        }).then(
            response => response.json(),
            error => console.log("An error has occurred!!", error)
        ).then(
            json => dispatch(receiveGetPriority(json))
        )
    }
}

function receiveGetPriority(json) {
    return {
        type: RECEIVE_GET_TASK_PRIORITY,
        priority: json,
        receivedAt: Date.now()
    }
}

function requestUpdatePriority() {
    return {
        type: REQUEST_UPDATE_TASK_PRIORITY
    }
}

export function updatePriority(userGuid, taskGuid, priority) {
    let body = {
        priority: priority
    };
    return function (dispatch) {
        dispatch(requestUpdatePriority());
        return axios.patch(serverUrl + '/taskpriority/' + taskGuid, body, {
            headers: {
                'Content-Type': 'application/json',
                'userId': userGuid
            }
        }).then(
            response => dispatch(receiveUpdatePriority(response)),
            error => console.log("An error has occurred!!", error)
        );
    }
}

function receiveUpdatePriority(response) {
    if (response.priority === OK) {
        return {
            type: RECEIVE_UPDATE_TASK_PRIORITY,
            receivedAt: Date.now()
        }
    }
    return {
        type: RECEIVE_UPDATE_TASK_PRIORITY,
        receivedAt: Date.now()
    }
}

function requestDeletePriority() {
    return {
        type: REQUEST_DELETE_TASK_PRIORITY
    }
}

export function deletePriority(userGuid, taskGuid) {
    return function (dispatch) {
        dispatch(requestDeletePriority());
        return axios.delete(serverUrl + '/taskpriority/' + taskGuid, {
            headers: {
                'userId': userGuid
            }
        }).then(
            response => dispatch(receiveDeletePriority(response)),
            error => console.log("An error has occurred!!", error)
        );
    }
}

function receiveDeletePriority(response) {
    if (response.priority === OK) {
        return {
            type: RECEIVE_DELETE_TASK_PRIORITY,
            receivedAt: Date.now()
        }
    } else {
        return {
            type: RECEIVE_DELETE_TASK_PRIORITY,
            receivedAt: Date.now()
        }
    }
}