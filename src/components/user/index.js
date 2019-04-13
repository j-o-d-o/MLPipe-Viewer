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
            notFound: false,
        };
    }

    async componentDidMount() {
        this.updateUser(this.props.match.params.user);
    }
    componentWillUnmount() {
        this._mountGuard = true;
        this.props.hideLoading();
    }
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.match.params.user !== this.props.match.params.user)
            this.updateUser(this.props.match.params.user);
    }

    updateUser = async (userId) => {
        this._mountGuard = false;
        this.props.showLoading();

        const res = await UserApi.get(userId);
        if(this._mountGuard) return;

        this.props.hideLoading();
        if (res.status === 200) {
            this.setState({ user: res.json, notFound: false });
        }
        else if(res.status === 404) {
            this.setState({ user: null, notFound: true });
        }
        else {
            console.log(res);
            this.props.snackbarError("Error on getting User");
        }
    }

    logout = () => {
        this.props.logout();
    }

    getRole = (user) => {
        if(user == null) return "";

        switch(user.role){
            case 0: return "User";
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
                    { this.state.notFound && 
                        <h2>User does not exist or is inactive</h2>
                    }
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