import { combineReducers } from 'redux'
import {
    REQUEST_POSTS,
    RECEIVE_POSTS
} from './actions'
import {reducer as formReducer} from "redux-form";


function posts(
    state = {
        isFetching: false,
        result: []
    },
    action
) {
    switch (action.type) {
        case REQUEST_POSTS:
            return Object.assign({}, state, {
                isFetching: true,
            });
        case RECEIVE_POSTS:
            return Object.assign({}, state, {
                isFetching: false,
                result: action.result,
                lastUpdated: action.receivedAt
            });
        default:
            return state
    }
}

function postsBySubreddit(state = {}, action) {
    switch (action.type) {
        case RECEIVE_POSTS:
        case REQUEST_POSTS:
            return posts(state, action);
        default:
            return state
    }
}



const rootReducer = combineReducers({
    form: formReducer,
    postsBySubreddit
});

export default rootReducer