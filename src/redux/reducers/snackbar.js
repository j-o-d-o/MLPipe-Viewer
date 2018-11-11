import * as types from 'redux/actionTypes';
import { Map } from "immutable";


const initialState = Map({
    error_msg: '',
    info_msg : '',
});

export default function snackbarReducer(state = initialState, action) {
    switch (action.type) {
        case types.SNACKBAR_ERROR:
            // @param msg [string]: message that should be displayed
            return state.set("error_msg", action.msg);
        case types.SNACKBAR_INFO:
            // @param msg [string]: message that should be displayed
            return state.set("info_msg", action.msg);
        case types.SNACKBAR_RESET_ERROR:
            return state.set("error_msg", "");
        case types.SNACKBAR_RESET_INFO:
            return state.set("info_msg", "");
        default:
            return state;
    }
}