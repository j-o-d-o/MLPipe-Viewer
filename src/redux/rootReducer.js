import { loadingBarReducer } from 'react-redux-loading-bar';
import { combineReducers } from 'redux';

import auth from 'redux/reducers/auth';
import snackbar from 'redux/reducers/snackbar';


const rootReducer = combineReducers({
  loadingBar: loadingBarReducer,
  auth,
  snackbar,
})

export default rootReducer;