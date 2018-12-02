// TODO: placeholder doesnt look good... 

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { logout } from 'redux/actions/auth';
import { snackbarError } from 'redux/actions/snackbar';
import UserApi from 'apis/user';
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

    render() {
        let content;
        if (this.state.user === null) {
            content = (
                <div className="ph-item">
                    <div className="ph-col-6">
                        <div className="ph-row">
                            <div className="ph-col-6"></div>
                            <div className="ph-col-6"></div>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            content = (
                <div>
                    <div>Email: {this.state.user.email}</div>
                    <div>Name: {this.state.user.name}</div>
                </div>
            );
        }

        return (
            <div id="user-page" className="flex-content">
                <div id="user-content">
                    <h1>My Profile</h1>
                    {content}
                    <Button type="button" onClick={this.logout} style={{marginTop: "30px"}}>Logout</Button>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = { logout, snackbarError, showLoading, hideLoading};

export default connect(null, mapDispatchToProps)(User);