import axios from 'axios/index';

const OK = 200;
const CREATED = 201;
const INTERNAL_SERVER_ERROR = 500;

export const REQUEST_CREATE_CHANNEL = 'REQUEST_CREATE_CHANNEL';
export const RECEIVE_CREATE_CHANNEL = 'RECEIVE_CREATE_CHANNEL';
export const REQUEST_GET_ALL_CHANNELS = 'REQUEST_GET_ALL_CHANNELS';
export const RECEIVE_GET_ALL_CHANNELS = 'RECEIVE_GET_ALL_CHANNELS';
export const REQUEST_UPDATE_CHANNEL = 'REQUEST_UPDATE_CHANNEL';
export const RECEIVE_UPDATE_CHANNEL = 'RECEIVE_UPDATE_CHANNEL';
export const REQUEST_DELETE_CHANNEL = 'REQUEST_DELETE_CHANNEL';
export const RECEIVE_DELETE_CHANNEL = 'RECEIVE_DELETE_CHANNEL';

const serverUrl = process.env.REACT_APP_BACKEND_ADDRESS;

function requestCreateChannel() {
    return {
        type: REQUEST_CREATE_CHANNEL
    }
}

export function createChannel(userGuid, taskGuid, name) {
    let body = {
        name: name
    };
    return function (dispatch) {
        dispatch(requestCreateChannel());
        return axios.post(serverUrl + '/channel/' + taskGuid, body, {
            headers: {
                'Content-Type': 'application/json',
                'userId': userGuid
            }
        }).then(
            response => dispatch(receiveCreateChannel(response)),
            error => console.log("An error has occurred!!", error)
        );
    }
}

function receiveCreateChannel(response) {
    if (response.status === CREATED) {
        return {
            type: RECEIVE_CREATE_CHANNEL,
            newChannel: response.data,
            receivedAt: Date.now()
        }
    }
    return {
        type: RECEIVE_CREATE_CHANNEL,
        receivedAt: Date.now()
    }
}

function requestGetAllChannels() {
    return {
        type: REQUEST_GET_ALL_CHANNELS
    }
}

export function getAllChannels(userGuid, taskGuid) {
    return function (dispatch) {
        dispatch(requestGetAllChannels());
        return fetch(serverUrl + '/channel/' + taskGuid, {
            headers: {
                'userId': userGuid
            }
        }).then(
                response => response.json(),
                error => console.log("An error has occurred!!", error)
            ).then(
                json => dispatch(receiveGetAllChannels(json))
            )
    }
}

function receiveGetAllChannels(json) {
    return {
        type: RECEIVE_GET_ALL_CHANNELS,
        channels: json,
        receivedAt: Date.now()
    }
}


function requestUpdateChanel() {
    return {
        type: REQUEST_UPDATE_CHANNEL
    }
}

export function updateChannel(userGuid, channelGuid, name) {
    let body = {
        name: name
    };
    return function (dispatch) {
        dispatch(requestUpdateChanel());
        return axios.patch(serverUrl + '/channel/' + channelGuid, body, {
            headers: {
                'Content-Type': 'application/json',
                'userId': userGuid
            }
        }).then(
            response => dispatch(receiveUpdateChannel(response)),
            error => console.log("An error has occurred!!", error)
        );
    }
}

function receiveUpdateChannel(response) {
    if (response.status === OK) {
        return {
            type: RECEIVE_UPDATE_CHANNEL,
            receivedAt: Date.now()
        }
    }
    return {
        type: RECEIVE_UPDATE_CHANNEL,
        receivedAt: Date.now()
    }
}

function requestDeleteChannel() {
    return {
        type: REQUEST_DELETE_CHANNEL
    }
}

export function deleteChannel(userGuid, channelGuid) {
    return function (dispatch) {
        dispatch(requestDeleteChannel());
        return axios.delete(serverUrl + '/channel/' + channelGuid, {
            headers: {
                'userId': userGuid
            }
        }).then(
            response => dispatch(receiveDeleteChannel(response)),
            error => console.log("An error has occurred!!", error)
        );
    }
}

function receiveDeleteChannel(response) {
    if (response.status === OK) {
        return {
            type: RECEIVE_DELETE_CHANNEL,
            result: response.data,
            receivedAt: Date.now()
        }
    } else if (response.status === INTERNAL_SERVER_ERROR) {
        return {
            type: RECEIVE_DELETE_CHANNEL,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    } else {
        return {
            type: RECEIVE_DELETE_CHANNEL,
            result: response.status,
            receivedAt: Date.now()
        }
    }
}