import { loadingBarReducer } from 'react-redux-loading-bar'
import { combineReducers } from 'redux';

// import user from 'features/user/user.reducer';


const rootReducer = combineReducers({
  loadingBar: loadingBarReducer
})

export default rootReducer;  