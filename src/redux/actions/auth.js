import * as types from 'redux/actionTypes'; 
import * as localStorage from 'utils/localStorage.util';
import { CONFIG } from 'config';


export function login(user) {  
  localStorage.set(CONFIG.localStorageCredentials, user);
  return {type: types.LOGIN, user};
}

export function logout() {  
  localStorage.deleteValue(CONFIG.localStorageCredentials);
  return {type: types.LOGOUT};
}

export function updateLogged(user){
  return { type: types.UPDATE_LOGGED, user };
}