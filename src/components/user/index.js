// TODO: Check if profile is "own" profile and only show the specific parts

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { logout } from 'redux/actions/auth';
import { snackbarError } from 'redux/actions/snackbar';
import Keystore from './keystore';
import UserApi from 'apis/user';
import * as authUtil from 'utils/auth.util';
import { Button } from '@rmwc/button';


class User extends React.Component {
    static propTypes = {
        logout: PropTypes.func.isRequired,
        snackbarError: PropTypes.func.isRequired,
        showLoading: PropTypes.func.isRequired,
        hideLoading: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
        this._mountGuard = true;

        this.state = {
            user: null,
        };
    }

    async componentWillMount() {
        this._mountGuard = false;
        this.props.showLoading();

        const res = await UserApi.get(this.props.match.params.user);
        if(this._mountGuard) return;

        this.props.hideLoading();
        if (res.status === 200) {
            this.setState({ user: res.json });
        }
        else {
            console.log(res);
            this.props.snackbarError("Error on getting User");
        }
    }
    componentWillUnmount() {
        this._mountGuard = true;
        this.props.hideLoading();
    }

    logout = () => {
        this.props.logout();
        window.location.href = "/";
    }

    getRole = (user) => {
        if(user == null) return "";

        switch(user.role){
            case 0: return "Developer";
            case 100: return "Admin";
            default: return "Unkown " + user.role;
        }
    }

    render() {
        const user = this.state.user;
        const loggedUser = authUtil.getUser();

        return (
            <div id="user-page" className="flex-content">
                <div id="user-content">
                    <h1>{user != null ? user.name : ""}</h1>
                    <div>
                        <div><span className="user-info">Email:</span> {user != null ? user.email: ""}</div>
                        <div><span className="user-info">Role:</span> {this.getRole(user)}</div>
                    </div>
                    { (user != null && user._id === loggedUser._id) &&
                        <div>
                            <Keystore userId={user._id}/>
                            <Button type="button" onClick={this.logout} style={{marginTop: "30px"}}>Logout</Button>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = { logout, snackbarError, showLoading, hideLoading};

export default connect(null, mapDispatchToProps)(User);