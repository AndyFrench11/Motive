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
import {USER_LOGOUT} from "./Common/Auth/actions";

const appReducer = combineReducers({
    form: formReducer,
    createProjectController,
    authReducer,
    signUpReducer,
    profilePage,
    projectController,
    projectTaskController,
    projectOwnersController
});

const rootReducer = (state, action) => {
    if (action.type === USER_LOGOUT) {
        state = undefined
    }

    return appReducer(state, action)
};

export default rootReducer