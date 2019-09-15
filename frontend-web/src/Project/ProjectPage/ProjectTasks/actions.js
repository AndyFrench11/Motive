import axios from 'axios/index'

export const REQUEST_UPDATE_TASK = 'REQUEST_UPDATE_TASK';
export const RECEIVE_UPDATE_TASK_RESPONSE = 'RECEIVE_UPDATE_TASK_RESPONSE';

export const REQUEST_NEW_TASK = 'REQUEST_NEW_TASK';
export const RECEIVE_NEW_TASK_RESPONSE = 'RECEIVE_NEW_TASK_RESPONSE';

export const REQUEST_DELETE_TASK = 'REQUEST_DELETE_TASK';
export const RECEIVE_DELETE_TASK_RESPONSE = 'RECEIVE_DELETE_TASK_RESPONSE';

export const REQUEST_UPDATE_TASK_ORDER = 'REQUEST_UPDATE_TASK_ORDER';
export const RECEIVE_UPDATE_TASK_ORDER_RESPONSE = 'RECEIVE_UPDATE_TASK_ORDER_RESPONSE';

const serverUrl = process.env.REACT_APP_BACKEND_ADDRESS;

function requestNewTask() {
    return {
        type: REQUEST_NEW_TASK,
    }
}

export function postTask(projectGuid, valuesJson) {
    return dispatch => {
        dispatch(requestNewTask());
        //Take only the values needed for the request
        let newTask = {
            name: valuesJson.name,
            completed: valuesJson.completed,
            orderIndex: valuesJson.orderIndex,
            guid: valuesJson.guid
        };

        console.log(newTask);

        return axios.post(serverUrl + "/projectTask", newTask, {headers: {
                'Content-Type': 'application/json',
                'projectId': projectGuid
            }
        })
            .then(response => dispatch(receiveNewTaskResponse(response)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error.response)
            })

    }
}

function receiveNewTaskResponse(response) {
    if(response.status === 201) {
        return {
            type: RECEIVE_NEW_TASK_RESPONSE,
            result: response.data,
            receivedAt: Date.now()
        }
    } else if(response.status === 500) {
        return {
            type: RECEIVE_NEW_TASK_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    }
}

function requestDeleteTask() {
    return {
        type: REQUEST_DELETE_TASK,
    }
}

export function deleteTask(taskGuid) {
    return dispatch => {
        dispatch(requestDeleteTask());
    
        return axios.delete(serverUrl + "/projectTask/" + taskGuid)
            .then(response => dispatch(receiveDeleteTaskResponse(response)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error.response)
            })

    }
}

function receiveDeleteTaskResponse(response) {
    if(response.status === 200) {
        return {
            type: RECEIVE_DELETE_TASK_RESPONSE,
            result: response.data,
            receivedAt: Date.now()
        }
    } else if(response.status === 500) {
        return {
            type: RECEIVE_DELETE_TASK_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    }
}

function requestUpdateTask() {
    return {
        type: REQUEST_UPDATE_TASK,
    }
}

export function updateTask(taskGuid, valuesJson) {
    return dispatch => {
        dispatch(requestUpdateTask());
        //Take only the values needed for the request
        let taskUpdates = {
            completed: valuesJson.completed
        };

        return axios.patch(serverUrl + "/projectTask", taskUpdates, {headers: {
                'Content-Type': 'application/json',
                'projectTaskId': taskGuid
            }
        })
            .then(response => dispatch(receiveUpdateTaskResponse(response)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error.response)
            })

    }
}

function receiveUpdateTaskResponse(response) {
    if(response.status === 200) {
        return {
            type: RECEIVE_UPDATE_TASK_RESPONSE,
            result: response.data,
            receivedAt: Date.now()
        }
    } else if(response.status === 500) {
        return {
            type: RECEIVE_UPDATE_TASK_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    }
}

function requestUpdateTaskOrder() {
    return {
        type: REQUEST_UPDATE_TASK_ORDER,
    }
}

export function updateTaskOrder(projectGuid, taskList) {
    return dispatch => {
        dispatch(requestUpdateTaskOrder());
        //Take only the values needed for the request

        return axios.patch(serverUrl + `/project/${projectGuid}/tasks`, taskList, {headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => dispatch(receiveUpdateTaskOrderResponse(response)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error.response)
            })

    }
}

function receiveUpdateTaskOrderResponse(response) {
    if(response.status === 200) {
        return {
            type: RECEIVE_UPDATE_TASK_ORDER_RESPONSE,
            result: response.data,
            receivedAt: Date.now()
        }
    } else if(response.status === 500) {
        return {
            type: RECEIVE_UPDATE_TASK_ORDER_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    }
}