//import { loadingBarReducer } from 'react-redux-loading-bar';
import { combineReducers } from 'redux';

import auth from 'redux/reducers/auth';
import user from 'redux/reducers/user';


const rootReducer = combineReducers({
  //loadingBar: loadingBarReducer,
  auth,
  user,
})

export default rootReducer;