import {combineReducers} from "redux";
import {reducer as formReducer} from "redux-form";
import authReducer from "./Common/Auth/reducer";
import signUpReducer from "./Signup/reducers";
import profilePage from "./UserProfile/reducers";
import {
    createProjectController,
    projectController,
    projectOwnersController,
} from "./Project/reducers";
import projectTaskReducer from "./Project/ProjectPage/ProjectTasks/reducers";
import projectSettingsReducer from "./Project/ProjectPage/ProjectSettings/reducers";
import projectDetailsReducer from "./Project/ProjectPage/ProjectDetails/reducers";
import createProjectUpdateReducer from "./Project/ProjectPage/ProjectUpdates/CreateProjectUpdateModal/reducers";
import projectUpdateReducer from "./Project/ProjectPage/ProjectUpdates/ProjectUpdate/reducers";


import {USER_LOGOUT} from "./Common/Auth/actions";

const appReducer = combineReducers({
    form: formReducer,
    createProjectController,
    authReducer,
    signUpReducer,
    profilePage,
    projectController,
    projectTaskReducer,
    projectOwnersController,
    projectSettingsReducer,
    projectDetailsReducer,
    createProjectUpdateReducer,
    projectUpdateReducer
});

const rootReducer = (state, action) => {
    if (action.type === USER_LOGOUT) {
        state = undefined
    }

    return appReducer(state, action)
};

export default rootReducer