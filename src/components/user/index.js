import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { logout } from 'redux/actions/auth';
import { snackbarError } from 'redux/actions/snackbar';


const mapDispatchToProps = { logout, snackbarError, showLoading, hideLoading};

class User extends React.Component {
    static propTypes = {
        logout: PropTypes.func.isRequired,
        snackbarError: PropTypes.func.isRequired,
        showLoading: PropTypes.func.isRequired,
        hideLoading: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {};
        this.logout = this.logout.bind(this);
    }

    logout(e) {
        this.props.logout();
        window.location.href = "/";
    }

    render() {
        return (
            <div id="user_page">
                <h1>USER PAGE</h1>
                <button onClick={this.logout}>Logout</button>
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(User);