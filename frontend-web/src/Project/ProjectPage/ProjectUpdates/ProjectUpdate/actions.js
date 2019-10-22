import axios from 'axios/index'

export const REQUEST_PROJECT_UPDATES = 'REQUEST_PROJECT_UPDATES';
export const RECEIVE_PROJECT_UPDATES = 'RECEIVE_PROJECT_UPDATES';

export const REQUEST_UPDATE_PROJECT_UPDATE_CONTENT = 'REQUEST_UPDATE_PROJECT_UPDATE_CONTENT';
export const RECEIVE_UPDATE_PROJECT_UPDATE_CONTENT_RESPONSE = 'RECEIVE_UPDATE_PROJECT_UPDATE_CONTENT_RESPONSE';

export const REQUEST_UPDATE_PROJECT_UPDATE_HIGHLIGHT = 'REQUEST_UPDATE_PROJECT_UPDATE_HIGHLIGHT';
export const RECEIVE_UPDATE_PROJECT_UPDATE_HIGHLIGHT_RESPONSE = 'RECEIVE_UPDATE_PROJECT_UPDATE_HIGHLIGHT_RESPONSE';

export const REQUEST_DELETE_PROJECT_UPDATE = 'REQUEST_DELETE_PROJECT_UPDATE';
export const RECEIVE_DELETE_PROJECT_UPDATE_RESPONSE = 'RECEIVE_DELETE_PROJECT_UPDATE_RESPONSE';

const serverUrl = process.env.REACT_APP_BACKEND_ADDRESS;

function requestProjectUpdates() {
    return {
        type: REQUEST_PROJECT_UPDATES
    }
}

function receiveProjectUpdates(json) {
    return {
        type: RECEIVE_PROJECT_UPDATES,
        updates: json
    }
}

export function fetchProjectUpdates (projectGuid) {
    return function (dispatch) {
        dispatch(requestProjectUpdates());
        return fetch(serverUrl + `/projectUpdate/${projectGuid}/project`, {
            withCredentials: true,
        })
            .then(
                response => response.json(),
                error => console.log("An error has occurred!!", error)
            )
            .then(
                json => dispatch(receiveProjectUpdates(json))
            )

    }
}

function requestUpdateProjectUpdateContent() {
    return {
        type: REQUEST_UPDATE_PROJECT_UPDATE_CONTENT,
    }
}

export function updateProjectUpdateContent(updateGuid, newContent, projectGuid) {
    return dispatch => {
        dispatch(requestUpdateProjectUpdateContent());
        //Take only the values needed for the request
        let updateContent = {
            newContent: newContent
        }
        return axios.patch(serverUrl + `/projectUpdate/${updateGuid}/content` , updateContent, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => dispatch(receiveUpdateProjectUpdateContentResponse(response, dispatch, projectGuid)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error.response)
            })

    }
}

function receiveUpdateProjectUpdateContentResponse(response, dispatch, projectGuid) {
    if(response.status === 200) {
        dispatch(fetchProjectUpdates(projectGuid))
        return {
            type: RECEIVE_UPDATE_PROJECT_UPDATE_CONTENT_RESPONSE,
            result: response.data,
            receivedAt: Date.now()
        }
    } else if(response.status === 500) {
        return {
            type: RECEIVE_UPDATE_PROJECT_UPDATE_CONTENT_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    }
}

function requestUpdateProjectUpdateHighlight() {
    return {
        type: REQUEST_UPDATE_PROJECT_UPDATE_HIGHLIGHT,
    }
}

export function updateProjectUpdateHighlight(updateGuid, newHighlightStatus) {
    return dispatch => {
        dispatch(requestUpdateProjectUpdateHighlight());
        //Take only the values needed for the request
        let updateContent = {
            newHighlightStatus: newHighlightStatus
        }
        return axios.patch(serverUrl + `/projectUpdate/${updateGuid}/highlight` , updateContent, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => dispatch(receiveUpdateProjectUpdateHighlightResponse(response)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error.response)
            })

    }
}

function receiveUpdateProjectUpdateHighlightResponse(response) {
    if(response.status === 200) {
        return {
            type: RECEIVE_UPDATE_PROJECT_UPDATE_HIGHLIGHT_RESPONSE,
            result: response.data,
            receivedAt: Date.now()
        }
    } else if(response.status === 500) {
        return {
            type: RECEIVE_UPDATE_PROJECT_UPDATE_HIGHLIGHT_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    }
}

function requestDeleteProjectUpdate() {
    return {
        type: REQUEST_DELETE_PROJECT_UPDATE,
    }
}

export function deleteProjectUpdate(updateGuid, projectGuid) {
    return dispatch => {
        dispatch(requestDeleteProjectUpdate());
    
        return axios.delete(serverUrl + "/projectUpdate/" + updateGuid, {
            withCredentials: true,
        })
            .then(response => dispatch(receiveDeleteProjectUpdateResponse(response, dispatch, projectGuid)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error.response)
            })

    }
}

function receiveDeleteProjectUpdateResponse(response, dispatch, projectGuid) {
    if(response.status === 200) {
        dispatch(fetchProjectUpdates(projectGuid))
        return {
            type: RECEIVE_DELETE_PROJECT_UPDATE_RESPONSE,
            result: response.data,
            receivedAt: Date.now()
        }
    } else if(response.status === 500) {
        return {
            type: RECEIVE_DELETE_PROJECT_UPDATE_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    }
}
