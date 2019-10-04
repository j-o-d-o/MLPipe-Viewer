import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { snackbarError } from 'redux/actions/snackbar';
import { updateLogged } from 'redux/actions/auth';
import UserApi from 'apis/user';
import * as authUtil from 'utils/auth.util';
import UserForm from './user.form';
import { LinearProgress } from '@rmwc/linear-progress';
import { Button } from '@rmwc/button';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogButton
} from '@rmwc/dialog';


class UpdateUserDialog extends React.Component {
    static propTypes = {
        snackbarError: PropTypes.func.isRequired,
        cb: PropTypes.func,
    }
    static defaultProps = {
        cb: () => {},
    }

    constructor(props) {
        super(props);
        this._mountGuard = true;

        this.state = {
            showDialog: false,
            sending: false,
            validation: null,
            user: {},
        };
    }

    componentDidMount() {
        this._mountGuard = false;
        this.props.provider({
            show: (user) => {
                this._userForm.setData(user);
                this.setState({showDialog: true, user: user});
            },
        });
    }
    componentWillUnmount() {
        this._mountGuard = true;
        this.props.provider(null);
    }

    submit = async (evt) => {
        evt.preventDefault();
        if(this.state.sending) return;

        this.setState({ sending: true, validation: null });
        const res = await UserApi.update(this.state.user._id, { user: this._userForm.getData()});
        if(this._mountGuard) return;

        this.setState({ sending: false });
        if (res.status === 200) {
            this.props.cb(res.json);
            this._userForm.reset();
            this.setState({ showDialog: false });
            // in case we are updating the current logged in user, we also need to update the redux store
            if(authUtil.getUser() !== undefined  && authUtil.getUser()._id === res.json._id) {
                this.props.updateLogged(res.json);
            }
        }
        else if (res.status === 400) {
            this.setState({validation: res});
        }
        else {
            console.log(res);
            this.props.snackbarError("Error on updating User");
        }
    }

    render() {
        return (
            <Dialog
                id="update-user-dialog"
                open={this.state.showDialog}
                onClose={evt => this.setState({showDialog: false})}
            >
                <LinearProgress style={{position: "absolute", zIndex: 1}} id="update-user-progress-bar" closed={!this.state.sending}/>
                <DialogTitle>Update User</DialogTitle>
                <DialogContent id="dialog-content">
                    <UserForm
                        id="update-user-form"
                        provider={provide => this._userForm = provide}
                        validation={this.state.validation}
                        onSubmit={this.submit}
                        edit={true}/>
                </DialogContent>
                <DialogActions>
                    <DialogButton action="close">Cancel</DialogButton>
                    <div style={{flex: 1}}></div>
                    <Button raised disabled={this.state.sending} type="submit" form="update-user-form">Update</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapDispatchToProps = { updateLogged, snackbarError };
export default connect(null, mapDispatchToProps)(UpdateUserDialog);