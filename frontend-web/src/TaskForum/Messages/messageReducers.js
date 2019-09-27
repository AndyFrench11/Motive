import {combineReducers} from 'redux'
import {
    REQUEST_CREATE_CHANNEL_MESSAGE,
    RECEIVE_CREATE_CHANNEL_MESSAGE,
    REQUEST_UPDATE_CHANNEL_MESSAGE,
    RECEIVE_UPDATE_CHANNEL_MESSAGE,
    REQUEST_DELETE_CHANNEL_MESSAGE,
    RECEIVE_DELETE_CHANNEL_MESSAGE
} from './messageActions'

function messageController(state = {}, action) {
    switch (action.type) {
        case REQUEST_CREATE_CHANNEL_MESSAGE:
            return state;
        case RECEIVE_CREATE_CHANNEL_MESSAGE:
            return {
                ...state,
                newMessage: action.message
            };
        case REQUEST_UPDATE_CHANNEL_MESSAGE:
            return state;
        case RECEIVE_UPDATE_CHANNEL_MESSAGE:
            return state;
        case REQUEST_DELETE_CHANNEL_MESSAGE:
            return state;
        case RECEIVE_DELETE_CHANNEL_MESSAGE:
            return {
                ...state,
                result: action.result
            };
        default:
            return state;
    }
}

const channelMessageReducer = combineReducers({
    messageController
});

export default channelMessageReducer