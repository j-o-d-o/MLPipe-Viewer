import store from 'redux/store';
import * as authActions from 'redux/actions/auth'; 
import * as authUtil from 'utils/auth.util';


export function apply(res, status) {
    // If "not authorized" 401 error but there is logged in user stored, logg the user out
    if(res.status === 401 && authUtil.isLogged()){
        store.dispatch(authActions.logout());
    }
}