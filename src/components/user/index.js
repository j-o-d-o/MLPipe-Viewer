import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

//import AuthApi from './api';
//import { login } from './actions';

class User extends React.Component {
    render() {
        return (
            <div id="user_page">
                <h1>USER PAGE</h1>
            </div>
        );
    }
}

export default User;