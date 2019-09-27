import axios from 'axios/index';

const OK = 200;
const CREATED = 201;
const INTERNAL_SERVER_ERROR = 500;

export const REQUEST_CREATE_CHANNEL_MESSAGE = 'REQUEST_CREATE_CHANNEL_MESSAGE';
export const RECEIVE_CREATE_CHANNEL_MESSAGE = 'RECEIVE_CREATE_CHANNEL_MESSAGE';
export const REQUEST_UPDATE_CHANNEL_MESSAGE = 'REQUEST_UPDATE_CHANNEL_MESSAGE';
export const RECEIVE_UPDATE_CHANNEL_MESSAGE = 'RECEIVE_UPDATE_CHANNEL_MESSAGE';
export const REQUEST_DELETE_CHANNEL_MESSAGE = 'REQUEST_DELETE_CHANNEL_MESSAGE';
export const RECEIVE_DELETE_CHANNEL_MESSAGE = 'RECEIVE_DELETE_CHANNEL_MESSAGE';

const serverUrl = process.env.REACT_APP_BACKEND_ADDRESS;

function requestCreateMessage() {
    return {
        type: REQUEST_CREATE_CHANNEL_MESSAGE
    }
}

export function createMessage(userGuid, channelGuid, text) {
    let body = {
        text: text
    };
    return function (dispatch) {
        dispatch(requestCreateMessage());
        return axios.post(serverUrl + '/message/' + channelGuid, body, {
            headers: {
                'Content-Type': 'application/json',
                'userId': userGuid
            }
        }).then(
            response => dispatch(receiveCreateMessage(response)),
            error => console.log("An error has occurred!!", error)
        );
    }
}

function receiveCreateMessage(response) {
    if (response.status === CREATED) {
        return {
            type: RECEIVE_CREATE_CHANNEL_MESSAGE,
            message: response.data,
            receivedAt: Date.now()
        }
    }
    return {
        type: RECEIVE_CREATE_CHANNEL_MESSAGE,
        receivedAt: Date.now()
    }
}

function requestUpdateMessage() {
    return {
        type: REQUEST_UPDATE_CHANNEL_MESSAGE
    }
}

export function updateMessage(userGuid, messageGuid, text) {
    let body = {
        text: text
    };
    return function (dispatch) {
        dispatch(requestUpdateMessage());
        return axios.patch(serverUrl + '/message/' + messageGuid, body, {
            headers: {
                'Content-Type': 'application/json',
                'userId': userGuid
            }
        }).then(
            response => dispatch(receiveUpdateMessage(response)),
            error => console.log("An error has occurred!!", error)
        );
    }
}

function receiveUpdateMessage(response) {
    if (response.status === OK) {
        return {
            type: RECEIVE_UPDATE_CHANNEL_MESSAGE,
            receivedAt: Date.now()
        }
    }
    return {
        type: RECEIVE_UPDATE_CHANNEL_MESSAGE,
        receivedAt: Date.now()
    }
}

function requestDeleteMessage() {
    return {
        type: REQUEST_DELETE_CHANNEL_MESSAGE
    }
}

export function deleteMessage(userGuid, messageGuid) {
    return function (dispatch) {
        dispatch(requestDeleteMessage());
        return axios.delete(serverUrl + '/message/' + messageGuid, {
            headers: {
                'userId': userGuid
            }
        }).then(
            response => dispatch(receiveDeleteMessage(response)),
            error => console.log("An error has occurred!!", error)
        );
    }
}

function receiveDeleteMessage(response) {
    if (response.status === OK) {
        return {
            type: RECEIVE_DELETE_CHANNEL_MESSAGE,
            result: response.data,
            receivedAt: Date.now()
        }
    } else if (response.status === INTERNAL_SERVER_ERROR) {
        return {
            type: RECEIVE_DELETE_CHANNEL_MESSAGE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    } else {
        return {
            type: RECEIVE_DELETE_CHANNEL_MESSAGE,
            result: response.status,
            receivedAt: Date.now()
        }
    }
}