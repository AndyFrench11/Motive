import axios from 'axios/index';

const OK = 200;
export const REQUEST_GET_TASK_ASSIGNEE = 'REQUEST_GET_TASK_ASSIGNEE';
export const RECEIVE_GET_TASK_ASSIGNEE = 'RECEIVE_GET_TASK_ASSIGNEE';
export const REQUEST_UPDATE_TASK_ASSIGNEE = 'REQUEST_UPDATE_TASK_ASSIGNEE';
export const RECEIVE_UPDATE_TASK_ASSIGNEE = 'RECEIVE_UPDATE_TASK_ASSIGNEE';
export const REQUEST_DELETE_TASK_ASSIGNEE = 'REQUEST_DELETE_TASK_ASSIGNEE';
export const RECEIVE_DELETE_TASK_ASSIGNEE = 'RECEIVE_DELETE_TASK_ASSIGNEE';

const serverUrl = process.env.REACT_APP_BACKEND_ADDRESS;
function requestGetAssignee() {
    return {
        type: REQUEST_GET_TASK_ASSIGNEE
    }
}

export function getAssignee(userGuid, taskGuid) {
    return function (dispatch) {
        dispatch(requestGetAssignee());
        return fetch(serverUrl + '/taskassignment/' + taskGuid, {
            headers: {
                'userId': userGuid
            }
        }).then(
            response => response.json(),
            error => console.log("An error has occurred!!", error)
        ).then(
            json => dispatch(receiveGetAssignee(json))
        )
    }
}

function receiveGetAssignee(json) {
    return {
        type: RECEIVE_GET_TASK_ASSIGNEE,
        assignee: json,
        receivedAt: Date.now()
    }
}

function requestUpdateAssignee() {
    return {
        type: REQUEST_UPDATE_TASK_ASSIGNEE
    }
}

export function updateAssignee(userGuid, taskGuid, assigneeGuid) {
    return function (dispatch) {
        dispatch(requestUpdateAssignee());
        return axios.patch(serverUrl + '/taskassignment/' + taskGuid + "/" + assigneeGuid, {
            headers: {
                'Content-Type': 'application/json',
                'userId': userGuid
            }
        }).then(
            response => dispatch(receiveUpdateAssignee(response)),
            error => console.log("An error has occurred!!", error)
        );
    }
}

function receiveUpdateAssignee(response) {
    if (response.priority === OK) {
        return {
            type: RECEIVE_UPDATE_TASK_ASSIGNEE,
            receivedAt: Date.now()
        }
    }
    return {
        type: RECEIVE_UPDATE_TASK_ASSIGNEE,
        receivedAt: Date.now()
    }
}

function requestDeleteAssignee() {
    return {
        type: REQUEST_DELETE_TASK_ASSIGNEE
    }
}

export function deleteAssignee(userGuid, taskGuid) {
    return function (dispatch) {
        dispatch(requestDeleteAssignee());
        return axios.delete(serverUrl + '/taskassignment/' + taskGuid, {
            headers: {
                'userId': userGuid
            }
        }).then(
            response => dispatch(receiveDeleteAssignee(response)),
            error => console.log("An error has occurred!!", error)
        );
    }
}

function receiveDeleteAssignee(response) {
    if (response.priority === OK) {
        return {
            type: RECEIVE_DELETE_TASK_ASSIGNEE,
            receivedAt: Date.now()
        }
    } else {
        return {
            type: RECEIVE_DELETE_TASK_ASSIGNEE,
            receivedAt: Date.now()
        }
    }
}