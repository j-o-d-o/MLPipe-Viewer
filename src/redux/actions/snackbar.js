import * as types from 'redux/actionTypes'; 


export function snackbarError(msg) {  
    return {type: types.SNACKBAR_ERROR, msg };
}

export function snackbarInfo(msg){
    return { type: types.SNACKBAR_INFO, msg };
}

export function snackbarResetError(){
    return { type: types.SNACKBAR_RESET_ERROR };
}

export function snackbarResetInfo(){
    return { type: types.SNACKBAR_RESET_INFO };
}