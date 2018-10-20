import store from 'redux/store';

export function isLogged() {
    return store.getState().auth.get('isLogged');
}

export function getToken() {
    let loggedUser = store.getState().auth.get('loggedUser');
    return loggedUser.get('token', '');
}

export function getUser() {
    let loggedUser = store.getState().auth.get('loggedUser');
    return loggedUser.toObject();
}