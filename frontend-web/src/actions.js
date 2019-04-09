import fetch from 'cross-fetch'

export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'

function requestPosts() {
    return {
        type: REQUEST_POSTS,
    }
}

function receivePosts(json) {
    return {
        type: RECEIVE_POSTS,
        result: json.data,
        receivedAt: Date.now()
    }
}

export function fetchPosts() {
    return dispatch => {
        dispatch(requestPosts())
        return fetch(`https://www.reddit.com/r/nbastreams.json`)
            .then(response => response.json())
            .then(json => dispatch(receivePosts(json)))
    }
}
