import axios from 'axios/index';

const OK = 200;
export const REQUEST_GET_TASK_STATUS = 'REQUEST_GET_TASK_STATUS';
export const RECEIVE_GET_TASK_STATUS = 'RECEIVE_GET_TASK_STATUS';
export const REQUEST_UPDATE_TASK_STATUS = 'REQUEST_UPDATE_TASK_STATUS';
export const RECEIVE_UPDATE_TASK_STATUS = 'RECEIVE_UPDATE_TASK_STATUS';
export const REQUEST_DELETE_TASK_STATUS = 'REQUEST_DELETE_TASK_STATUS';
export const RECEIVE_DELETE_TASK_STATUS = 'RECEIVE_DELETE_TASK_STATUS';

const serverUrl = process.env.REACT_APP_BACKEND_ADDRESS;
function requestGetStatus() {
    return {
        type: REQUEST_GET_TASK_STATUS
    }
}

export function getStatus(userGuid, taskGuid) {
    return function (dispatch) {
        dispatch(requestGetStatus());
        return fetch(serverUrl + '/taskstatus/' + taskGuid, {
            headers: {
                'userId': userGuid
            }
        }).then(
            response => response.json(),
            error => console.log("An error has occurred!!", error)
        ).then(
            json => dispatch(receiveGetStatus(json))
        )
    }
}

function receiveGetStatus(json) {
    return {
        type: RECEIVE_GET_TASK_STATUS,
        status: json,
        receivedAt: Date.now()
    }
}

function requestUpdateStatus() {
    return {
        type: REQUEST_UPDATE_TASK_STATUS
    }
}

export function updateStatus(userGuid, taskGuid, status) {
    let body = {
        status: status
    };
    return function (dispatch) {
        dispatch(requestUpdateStatus());
        return axios.patch(serverUrl + '/taskstatus/' + taskGuid, body, {
            headers: {
                'Content-Type': 'application/json',
                'userId': userGuid
            }
        }).then(
            response => dispatch(receiveUpdateStatus(response)),
            error => console.log("An error has occurred!!", error)
        );
    }
}

function receiveUpdateStatus(response) {
    if (response.status === OK) {
        return {
            type: RECEIVE_UPDATE_TASK_STATUS,
            receivedAt: Date.now()
        }
    }
    return {
        type: RECEIVE_UPDATE_TASK_STATUS,
        receivedAt: Date.now()
    }
}

function requestDeleteStatus() {
    return {
        type: REQUEST_DELETE_TASK_STATUS
    }
}

export function deleteStatus(userGuid, taskGuid) {
    return function (dispatch) {
        dispatch(requestDeleteStatus());
        return axios.delete(serverUrl + '/taskstatus/' + taskGuid, {
            headers: {
                'userId': userGuid
            }
        }).then(
            response => dispatch(receiveDeleteStatus(response)),
            error => console.log("An error has occurred!!", error)
        );
    }
}

function receiveDeleteStatus(response) {
    if (response.status === OK) {
        return {
            type: RECEIVE_DELETE_TASK_STATUS,
            receivedAt: Date.now()
        }
    } else {
        return {
            type: RECEIVE_DELETE_TASK_STATUS,
            receivedAt: Date.now()
        }
    }
}