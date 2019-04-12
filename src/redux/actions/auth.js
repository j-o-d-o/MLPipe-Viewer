import * as types from 'redux/actionTypes'; 


export function login(user) {  
  return {type: types.LOGIN, user};
}

export function logout() {  
  return {type: types.LOGOUT};
}

export function updateLogged(user){
  return { type: types.UPDATE_LOGGED, user };
}