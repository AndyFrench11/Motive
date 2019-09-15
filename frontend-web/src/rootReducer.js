import {combineReducers} from "redux";
import {reducer as formReducer} from "redux-form";
import authReducer from "./Common/Auth/reducer";
import signUpReducer from "./Signup/reducers";
import profilePage from "./UserProfile/reducers";
import {
    createProjectController,
    projectController,
    projectOwnersController,
    projectTaskController
} from "./Project/reducers";

const rootReducer = combineReducers({
    form: formReducer,
    createProjectController,
    authReducer,
    signUpReducer,
    profilePage,
    projectController,
    projectTaskController,
    projectOwnersController
});

export default rootReducer