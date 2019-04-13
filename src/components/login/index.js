// TODO: Add link to "forgot password"
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AuthApi from 'apis/auth';
import { login } from 'redux/actions/auth';
import { snackbarError } from 'redux/actions/snackbar';

import Validation from 'components/validation';
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';
import { LinearProgress } from '@rmwc/linear-progress';


class Login extends React.Component {
    static propTypes = {
        login: PropTypes.func.isRequired,
        snackbarError: PropTypes.func.isRequired,
    }
    constructor(props) {
        super(props);
        // This is a guard to not execute async code after component is unmounted
        this._mountGuard = true;

        this.state = {
            credentials: { email: '', password: '' },
            sending: false,
        }
    }

    componentDidMount = () => this._mountGuard = false;
    componentWillUnmount = () => this._mountGuard = true;

    submitLogin = async (e) => {
        e.preventDefault();

        this.setState({ sending: true });
        const res = await AuthApi.login(this.state.credentials);
        if(this._mountGuard) return;

        this.setState({ sending: false });
        if (res.status === 200) {
            this.props.login(res.json);
            const { from } = this.props.location.state || { from: { pathname: '/dashboard' } }
            this.props.history.push(from.pathname);
        }
        else if (res.status === 400) {
            this.setState({validation: res});
        }
        else {
            console.log(res);
            this.props.snackbarError("Error on login");
        }
    }

    handleChange = (event) => {
        const field = event.target.name;
        const credentials = this.state.credentials;
        credentials[field] = event.target.value;
        this.setState({ credentials: credentials });
    }

    render() {
        return (
            <div id="login-page" className="flex-content">
                <LinearProgress id="login-progress-bar" closed={!this.state.sending}/>
                <form onSubmit={this.submitLogin}>
                    <h2 style={{fontSize: "30px", marginTop: "0px", marginBottom: "27px"}}>Login</h2>
                    <Validation data={this.state.validation} />
                    <TextField label="Username / Email" name="email" onChange={this.handleChange} required={true}/>
                    <TextField label="Password" type="Password" name="password" onChange={this.handleChange} required={true}/>
                    <Button raised disabled={this.state.sending} type="submit" id="login-btn">Login</Button>
                </form>
            </div>
        );
    }
}

const mapDispatchToProps = {login, snackbarError};

export default connect(null, mapDispatchToProps)(Login)