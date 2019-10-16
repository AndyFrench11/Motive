import axios from 'axios/index'

export const REQUEST_UPDATE_PROJECT_NAME = 'REQUEST_UPDATE_PROJECT_NAME';
export const RECEIVE_UPDATE_PROJECT_NAME_RESPONSE = 'RECEIVE_UPDATE_PROJECT_NAME_RESPONSE';

export const REQUEST_UPDATE_PROJECT_DESCRIPTION = 'REQUEST_UPDATE_PROJECT_DESCRIPTION';
export const RECEIVE_UPDATE_PROJECT_DESCRIPTION_RESPONSE = 'RECEIVE_UPDATE_PROJECT_DESCRIPTION_RESPONSE';

export const REQUEST_UPDATE_PROJECT_IMAGE_INDEX = 'REQUEST_UPDATE_PROJECT_IMAGE_INDEX';
export const RECEIVE_UPDATE_PROJECT_IMAGE_INDEX_RESPONSE = 'RECEIVE_UPDATE_PROJECT_IMAGE_INDEX_RESPONSE';

export const REQUEST_DELETE_PROJECT = 'REQUEST_DELETE_PROJECT';
export const RECEIVE_DELETE_PROJECT_RESPONSE = 'RECEIVE_DELETE_PROJECT_RESPONSE';

export const REQUEST_NEW_TAG = 'REQUEST_NEW_TAG';
export const RECEIVE_NEW_TAG_RESPONSE = 'RECEIVE_NEW_TAG_RESPONSE';

export const REQUEST_REMOVE_TAG = 'REQUEST_REMOVE_TAG';
export const RECEIVE_REMOVE_TAG_RESPONSE = 'RECEIVE_REMOVE_TAG_RESPONSE';

const serverUrl = process.env.REACT_APP_BACKEND_ADDRESS;


function requestUpdateProjectName() {
    return {
        type: REQUEST_UPDATE_PROJECT_NAME,
    }
}

export function updateProjectName(projectGuid, newProjectName) {
    return dispatch => {
        dispatch(requestUpdateProjectName());
        //Take only the values needed for the request
        let projectUpdate = {
            newProjectName: newProjectName
        }

        return axios.patch(serverUrl + `/project/${projectGuid}/name` , projectUpdate, {headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => dispatch(receiveUpdateProjectNameResponse(response)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error.response)
            })

    }
}

function receiveUpdateProjectNameResponse(response) {
    if(response.status === 200) {
        return {
            type: RECEIVE_UPDATE_PROJECT_NAME_RESPONSE,
            result: response.data,
            receivedAt: Date.now()
        }
    } else if(response.status === 500) {
        return {
            type: RECEIVE_UPDATE_PROJECT_NAME_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    }
}

function requestUpdateProjectDescription() {
    return {
        type: REQUEST_UPDATE_PROJECT_DESCRIPTION,
    }
}

export function updateProjectDescription(projectGuid, newProjectDescription) {
    return dispatch => {
        dispatch(requestUpdateProjectDescription());
        //Take only the values needed for the request
        let projectUpdate = {
            newProjectDescription: newProjectDescription
        }

        return axios.patch(serverUrl + `/project/${projectGuid}/description` , projectUpdate, {headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => dispatch(receiveUpdateProjectDescriptionResponse(response)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error.response)
            })

    }
}

function receiveUpdateProjectDescriptionResponse(response) {
    if(response.status === 200) {
        return {
            type: RECEIVE_UPDATE_PROJECT_DESCRIPTION_RESPONSE,
            result: response.data,
            receivedAt: Date.now()
        }
    } else if(response.status === 500) {
        return {
            type: RECEIVE_UPDATE_PROJECT_DESCRIPTION_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    }
}

function requestUpdateProjectImageIndex() {
    return {
        type: REQUEST_UPDATE_PROJECT_IMAGE_INDEX,
    }
}

export function updateProjectImageIndex(projectGuid, imageIndex) {
    return dispatch => {
        dispatch(requestUpdateProjectImageIndex());
        //Take only the values needed for the request
        let projectUpdate = {
            newImageIndex: imageIndex
        }

        return axios.patch(serverUrl + `/project/${projectGuid}/imageIndex` , projectUpdate, {headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => dispatch(receiveUpdateProjectImageIndexResponse(response)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error.response)
            })

    }
}

function receiveUpdateProjectImageIndexResponse(response) {
    if(response.status === 200) {
        return {
            type: RECEIVE_UPDATE_PROJECT_IMAGE_INDEX_RESPONSE,
            result: response.data,
            receivedAt: Date.now()
        }
    } else if(response.status === 500) {
        return {
            type: RECEIVE_UPDATE_PROJECT_IMAGE_INDEX_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    }
}

function requestNewTag() {
    return {
        type: REQUEST_NEW_TAG,
    }
}

export function postTag(projectGuid, tag) {
    return dispatch => {
        dispatch(requestNewTag());
        //Take only the values needed for the request

        return axios.post(serverUrl + `/project/${projectGuid}/tags`, tag, {headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => dispatch(receiveNewTagResponse(response)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error.response)
            })

    }
}

function receiveNewTagResponse(response) {
    if(response.status === 201) {
        return {
            type: RECEIVE_NEW_TAG_RESPONSE,
            result: response.data,
            receivedAt: Date.now()
        }
    } else if(response.status === 500) {
        return {
            type: RECEIVE_NEW_TAG_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    }
}

function requestRemoveTag() {
    return {
        type: REQUEST_REMOVE_TAG,
    }
}

export function removeTag(projectGuid, tag) {
    return dispatch => {
        dispatch(requestRemoveTag());
    
        return axios.delete(serverUrl + `/project/${projectGuid}/tags`, {headers: {
                'tagName': tag.name
            }
        })
            .then(response => dispatch(receiveRemoveTagResponse(response)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error.response)
            })

    }
}

function receiveRemoveTagResponse(response) {
    if(response.status === 200) {
        return {
            type: RECEIVE_REMOVE_TAG_RESPONSE,
            result: response.data,
            receivedAt: Date.now()
        }
    } else if(response.status === 500) {
        return {
            type: RECEIVE_REMOVE_TAG_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    }
}

