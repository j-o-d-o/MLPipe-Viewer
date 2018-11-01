import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import AuthApi from './api';
import * as authActions from './actions';
import * as authUtil from 'utils/auth.util';

//import Validation from 'shared/validation';

// TextField
// Button
// Snackbar


function mapStateToProps(state, ownProps) {
    return {
        auth: state.auth.toObject()
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({...authActions}, dispatch),
    };
}

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.submitLogin = this.submitLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            credentials: { email: '', password: '' },
            sending: false
        }
    }

    submitLogin(e) {
        e.preventDefault();
        this.setState({ sending: true });
        this.props.actions.showLoading();
 
        AuthApi.login(this.state.credentials).then(res => {
            this.setState({ sending: false });
            this.props.actions.hideLoading();

            if (res.status === 200) {
                this.props.actions.login(res.json);
            }
            else if (res.status === 400) {
                this.setState({validation: res});
            }
            else {
                console.log(res);
                this.refs.snackbar.show({
                    message: "Oh no, an Error :(",
                    actionOnButton: false
                });
            }
        });

    }

    handleChange(event) {
        const field = event.target.name;
        const credentials = this.state.credentials;
        credentials[field] = event.target.value;
        this.setState({ credentials: credentials });
    }

    render() {
        if (authUtil.isLogged()) {
            const { from } = this.props.location.state || { from: { pathname: '/register' } }

            return (
                <Redirect to={from} />
            )
        }

        return (
            <div id="login_page">
                <div id="login_content">
                    <h2>Login</h2>
                    <form onSubmit={this.submitLogin}>
                        {/* <Validation data={this.state.validation} /> 
                        <Textfield label="Username / Email" name="email" onChange={this.handleChange} required={true}/>
                        <Textfield label="Password" type="Password" name="password" onChange={this.handleChange} required={true}/>
                        <MdcButton disabled={this.state.sending} type="submit" id="login_btn" className="mdc-button--accent">Login</MdcButton>
                        */}
                    </form>
                </div>
                {/* <Snackbar ref="snackbar"></Snackbar> */}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)