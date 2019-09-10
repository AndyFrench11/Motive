import axios from 'axios/index'

export const REQUEST_SINGLE_PROJECT = 'REQUEST_PROJECT';
export const RECEIVE_SINGLE_PROJECT = 'RECEIVE_PROJECT';

export const RECEIVE_NEW_PROJECT_RESPONSE = 'RECEIVE_NEW_PROJECT_RESPONSE';
export const REQUEST_NEW_PROJECT = 'REQUEST_NEW_PROJECT';

export const REQUEST_UPDATE_TASK = 'REQUEST_UPDATE_TASK';
export const RECEIVE_UPDATE_TASK_RESPONSE = 'RECEIVE_UPDATE_TASK_RESPONSE';

export const REQUEST_NEW_TASK = 'REQUEST_NEW_TASK';
export const RECEIVE_NEW_TASK_RESPONSE = 'RECEIVE_NEW_TASK_RESPONSE';

export const REQUEST_DELETE_TASK = 'REQUEST_DELETE_TASK';
export const RECEIVE_DELETE_TASK_RESPONSE = 'RECEIVE_DELETE_TASK_RESPONSE';

export const REQUEST_UPDATE_TASK_ORDER = 'REQUEST_UPDATE_TASK_ORDER';
export const RECEIVE_UPDATE_TASK_ORDER_RESPONSE = 'RECEIVE_UPDATE_TASK_ORDER_RESPONSE';

const serverUrl = process.env.REACT_APP_BACKEND_ADDRESS;

function requestSingleProject() {
    return {
        type: REQUEST_SINGLE_PROJECT,
    }
}

export function fetchProject(projectId) {
    return dispatch => {
        dispatch(requestSingleProject());
        return axios.get(serverUrl + "/project/" + projectId)
            .then(response => dispatch(receiveSingleProject(response)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error)
            })
    }
}

function receiveSingleProject(json) {
    return {
        type: RECEIVE_SINGLE_PROJECT,
        result: json.data,
        receivedAt: Date.now()
    }
}

export function postProject(guid, valuesJson, imageIndex) {
    return dispatch => {
        dispatch(requestNewProject());
        //Take only the values needed for the request
        let newProject = {
            name: valuesJson.projectNameInput,
            description: valuesJson.descriptionInput,
            taskList: valuesJson.taskList,
            tagList: valuesJson.tags,
            imageIndex
        };

        return axios.post(serverUrl + "/project", newProject, {headers: {
                'Content-Type': 'application/json',
                'userId': guid
            }
        })
            .then(response => dispatch(receiveNewProjectResponse(response)))
            .catch(error =>  {
                console.log("The server is not running!");
                console.log("Need to update UI with error!");
                console.log(error.response)
            })

    }
}

function requestNewProject() {
    return {
        type: REQUEST_NEW_PROJECT,
    }
}

function receiveNewProjectResponse(response) {
    if(response.status === 201) {
        return {
            type: RECEIVE_NEW_PROJECT_RESPONSE,
            result: response.data,
            receivedAt: Date.now()
        }
    } else if(response.status === 500) {
        return {
            type: RECEIVE_NEW_PROJECT_RESPONSE,
            result: "Internal Server Error",
            receivedAt: Date.now()
        }
    }
}

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
    
        console.log(taskList)

        return axios.patch(serverUrl + "/project/" + projectGuid, taskList, {headers: {
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

