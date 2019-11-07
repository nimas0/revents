import { LOGIN_USER, SIGN_OUT_USER } from "./authConstants"
import { closeModal } from "../modals/modalActions";

export const login = (creds) => {
    return dispatch => {
        // dispatch lets you do 2 or more things unlike returning the object
        dispatch({
            type: LOGIN_USER,
            payload: {
                creds
            }
        });
        dispatch(closeModal())
    } 
}

export const logout = () => {
    return {
        type: SIGN_OUT_USER
    }
}