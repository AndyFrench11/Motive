import { combineReducers } from 'redux'
import {
    REQUEST_CREATE_PROJECT_UPDATE_COMMENT,
    RECEIVE_CREATE_PROJECT_UPDATE_COMMENT,
    REQUEST_DELETE_PROJECT_UPDATE_COMMENT,
    RECEIVE_DELETE_PROJECT_UPDATE_COMMENT
} from './actions'

function commentController(state = {}, action) {
    switch (action.type) {
        case REQUEST_CREATE_PROJECT_UPDATE_COMMENT:
            return state;
        case RECEIVE_CREATE_PROJECT_UPDATE_COMMENT:
            return {...state,
                newComment: action.comment
            };
        case REQUEST_DELETE_PROJECT_UPDATE_COMMENT:
            return state;
        case RECEIVE_DELETE_PROJECT_UPDATE_COMMENT:
            return {...state,
                result: action.result
            };
        default:
            return state;
    }
}

const projectUpdateCommentReducer = combineReducers({
    commentController
});

export default projectUpdateCommentReducer