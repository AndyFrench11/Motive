import {combineReducers} from 'redux'
import {
    REQUEST_CREATE_CHANNEL,
    RECEIVE_CREATE_CHANNEL,
    REQUEST_GET_ALL_CHANNELS,
    RECEIVE_GET_ALL_CHANNELS,
    REQUEST_UPDATE_CHANNEL,
    RECEIVE_UPDATE_CHANNEL,
    REQUEST_DELETE_CHANNEL,
    RECEIVE_DELETE_CHANNEL
} from './channelActions'

function channelController(state = {}, action) {
    switch (action.type) {
        case REQUEST_CREATE_CHANNEL:
            return state;
        case RECEIVE_CREATE_CHANNEL:
            return {
                ...state,
                newChannel: action.newChannel
            };
        case REQUEST_GET_ALL_CHANNELS:
            return state;
        case RECEIVE_GET_ALL_CHANNELS:
            return {
                ...state,
                channels: action.channels
            };
        case REQUEST_UPDATE_CHANNEL:
            return state;
        case RECEIVE_UPDATE_CHANNEL:
            return state;
        case REQUEST_DELETE_CHANNEL:
            return state;
        case RECEIVE_DELETE_CHANNEL:
            return {
                ...state,
                result: action.result
            };
        default:
            return state;
    }
}

const channelReducer = combineReducers({
    channelController
});

export default channelReducer