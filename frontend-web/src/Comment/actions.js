import axios from 'axios/index';

const OK = 200;

export const REQUEST_PROJECT_UPDATE_COMMENTS = 'REQUEST_PROJECT_UPDATE_COMMENTS';
export const RECEIVE_PROJECT_UPDATE_COMMENTS = 'RECEIVE_PROJECT_UPDATE_COMMENTS';

const serverUrl = process.env.REACT_APP_BACKEND_ADDRESS;

function requestComments() {
    return {
        type: REQUEST_PROJECT_UPDATE_COMMENTS
    }
}

function receiveComments(json) {
    console.log(json);
    return {
        type: RECEIVE_PROJECT_UPDATE_COMMENTS,
        result: json
    }
}

export function fetchComments(userGuid, updateGuid) {
    return function (dispatch) {
        dispatch(requestComments());
        return fetch(serverUrl + '/comment/' + updateGuid, {headers: {
            'userId': userGuid
            }})
            .then(
                response => response.json(),
                error => console.log("An error has occurred!!", error)
            )
            .then(
                json => dispatch(receiveComments(json))
            )
    }
}


