import axios from 'axios/index'

export const REQUEST_PROJECT_UPDATES = 'REQUEST_PROJECT_UPDATES';
export const RECEIVE_PROJECT_UPDATES = 'RECEIVE_PROJECT_UPDATES';

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
        return fetch(serverUrl + `/projectUpdate/${projectGuid}/project`)
            .then(
                response => response.json(),
                error => console.log("An error has occurred!!", error)
            )
            .then(
                json => dispatch(receiveProjectUpdates(json))
            )

    }
}
