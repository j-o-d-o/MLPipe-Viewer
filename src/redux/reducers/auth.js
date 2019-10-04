import * as types from 'redux/actionTypes';
import * as localStorage from 'utils/localStorage.util';
import { CONFIG } from 'config';
import { Map } from "immutable";


let initalState = Map({
    tokenExpires: 0,
    isLogged: false,
    loggedUser: Map({
        _id: '',
        token : '',
        email : '',
        name: '',
        role: 0
    })
});

// Check if there is something in the local storage and update that
if(localStorage.exists(CONFIG.localStorageCredentials)){
    const loggedUser = localStorage.get(CONFIG.localStorageCredentials);
    const loggedUserMap = Map(loggedUser);
    initalState = initalState.set('isLogged', true).set('loggedUser', loggedUserMap);
}


export default function authReducer(state = initalState, action) {
    switch (action.type) {
        case types.LOGOUT: {
            // On logout -> page is reloaded, but return a state just in case
            localStorage.deleteValue(CONFIG.localStorageCredentials);
            // Just reload page on logout...
            window.location.href = "/";
            return state.set('isLogged', false).set('loggedUser', initalState);
        }
        case types.LOGIN: {
            // @param user [object]: a user object
            let userMap = Map(action.user);
            localStorage.set(CONFIG.localStorageCredentials, action.user);
            return state.set('isLogged', true).set('loggedUser', userMap);
        }
        case types.UPDATE_LOGGED: {
            // @param user [object]: a user object
            let userMap = Map(action.user);
            let loggedMap = state.get("loggedUser");
            let mergedMap = loggedMap.merge(userMap);
            localStorage.set(CONFIG.localStorageCredentials, mergedMap.toObject());
            return state.set('loggedUser', mergedMap);
        }
        default: {
            return state;
        }
    }
}