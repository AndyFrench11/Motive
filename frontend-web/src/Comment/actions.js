import axios from 'axios/index';

const OK = 200;
const CREATED = 201;
const INTERNAL_SERVER_ERROR = 500;

export const REQUEST_DELETE_PROJECT_UPDATE_COMMENT = 'REQUEST_DELETE_PROJECT_UPDATE_COMMENT';
export const RECEIVE_DELETE_PROJECT_UPDATE_COMMENT = 'RECEIVE_DELETE_PROJECT_UPDATE_COMMENT';
export const REQUEST_CREATE_PROJECT_UPDATE_COMMENT = 'REQUEST_CREATE_PROJECT_UPDATE_COMMENT';
export const RECEIVE_CREATE_PROJECT_UPDATE_COMMENT = 'RECEIVE_CREATE_PROJECT_UPDATE_COMMENT';

const serverUrl = process.env.REACT_APP_BACKEND_ADDRESS;

function requestCreateComment() {
    return {
        type: REQUEST_CREATE_PROJECT_UPDATE_COMMENT
    }
}

export function createComment(userGuid, updateGuid, message) {
    let body = {
        message: message
    };
    return function (dispatch) {
        dispatch(requestCreateComment());
        return axios.post(serverUrl + '/comment/' + updateGuid, body, {
            headers: {
                'Content-Type': 'application/json',
                'userId': userGuid
            }
        }).then(
            response => dispatch(receiveCreateComment(response)),
            error => console.log("An error has occurred!!", error)
        );
    }
}

function receiveCreateComment(response) {
    if (response.status === CREATED) {
        return {
            type: RECEIVE_CREATE_PROJECT_UPDATE_COMMENT,
            comment: response.data,
            receivedAt: Date.now()
        }
    }
    return {
        type: RECEIVE_CREATE_PROJECT_UPDATE_COMMENT,
        receivedAt: Date.now()
    }
}

function requestDeleteComment() {
    return {
        type: REQUEST_DELETE_PROJECT_UPDATE_COMMENT
    }
}

export function deleteComment(userGuid, commentGuid) {
    return function (dispatch) {
        dispatch(requestDeleteComment());
        return axios.delete(serverUrl + '/comment/' + commentGuid, {
            headers: {
                'userId': userGuid
            }
        }).then(
            response => dispatch(receiveDeleteComment(response)),
            error => console.log("An error has occurred!!", error)
        );
    }
}

function receiveDeleteComment(response) {
    if (response.status === OK) {
        return {
            type: RECEIVE_DELETE_PROJECT_UPDATE_COMMENT,
            result: response.data,
            receivedAt: Date.now()
        }
    } else if (response.status === INTERNAL_SERVER_ERROR) {
        return {
            type: RECEIVE_DELETE_PROJECT_UPDATE_COMMENT,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    } else {
        return {
            type: RECEIVE_DELETE_PROJECT_UPDATE_COMMENT,
            result: response.status,
            receivedAt: Date.now()
        }
    }
}


