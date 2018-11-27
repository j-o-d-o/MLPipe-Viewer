// TODO: Add link to "forgot password"
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import AuthApi from './api';
import { login } from './actions';
import { snackbarError } from 'components/layout/actions';

import Validation from 'components/validation';
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';
import { LinearProgress } from '@rmwc/linear-progress';


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({login, snackbarError}, dispatch),
    };
}

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.submitLogin = this.submitLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            credentials: { email: '', password: '' },
            sending: false,
        }
    }

    componentWillUnmount() {
        // TODO: Cancel fetch API
    }

    submitLogin(e) {
        e.preventDefault();
        this.setState({ sending: true });

        AuthApi.login(this.state.credentials).then(res => {
            this.setState({ sending: false });

            if (res.status === 200) {
                this.props.actions.login(res.json);
                const { from } = this.props.location.state || { from: { pathname: '/dashboard' } }
                this.props.history.push(from.pathname);
            }
            else if (res.status === 400) {
                this.setState({validation: res});
            }
            else {
                console.log(res);
                this.props.actions.snackbarError("Unkown error on login");
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
        return (
            <div id="login-page" className="flex-content">
                <LinearProgress id="login-progress-bar" determinate={false} closed={!this.state.sending}/>
                <form onSubmit={this.submitLogin}>
                    <Validation data={this.state.validation} />
                    <TextField label="Username / Email" name="email" onChange={this.handleChange} required={true}/>
                    <TextField label="Password" type="Password" name="password" onChange={this.handleChange} required={true}/>
                    <Button raised disabled={this.state.sending} type="submit" id="login-btn">Login</Button>
                </form>
            </div>
        );
    }
}

export default connect(null, mapDispatchToProps)(Login)