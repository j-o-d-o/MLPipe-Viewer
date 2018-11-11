import { loadingBarReducer } from 'react-redux-loading-bar';
import { combineReducers } from 'redux';

import auth from 'redux/reducers/auth';
import user from 'redux/reducers/user';
import snackbar from 'redux/reducers/snackbar';


const rootReducer = combineReducers({
  loadingBar: loadingBarReducer,
  auth,
  user,
  snackbar,
})

export default rootReducer;