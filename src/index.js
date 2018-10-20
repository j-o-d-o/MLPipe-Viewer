import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

// if ture the HTML5 history API is not available and forceRefresh should be used
// https://reacttraining.com/react-router/web/api/BrowserRouter/forcerefresh-bool
const supportsHistory = 'pushState' in window.history;
 
ReactDOM.render(
    <Provider store={store}> 
        <BrowserRouter forceRefresh={!supportsHistory}>
            {routes}
        </BrowserRouter>
    </Provider>
    , document.getElementById('root')
);