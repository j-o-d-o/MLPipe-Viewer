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

export function isLoggedUser(userId) {
    const isLoggedUser = userId === getUser()._id;
    return isLoggedUser;
}

export function isAdmin() {
    const user = getUser();
    return isLogged() && user.role >= 100;
}