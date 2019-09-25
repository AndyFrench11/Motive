import { combineReducers } from 'redux'
import {
    REQUEST_PROJECT_UPDATE_COMMENTS,
    RECEIVE_PROJECT_UPDATE_COMMENTS
} from './actions'

function commentController(state = {}, action) {
    switch (action.type) {
        case REQUEST_PROJECT_UPDATE_COMMENTS:
            return {... state,
                isRetrievingComments: true
            };
        case RECEIVE_PROJECT_UPDATE_COMMENTS:
            return {...state,
                isRetrievingComments: false,
                comments: action.result
            };
        default:
            return state;
    }
}

const projectUpdateCommentReducer = combineReducers({
    commentController
});

export default projectUpdateCommentReducer