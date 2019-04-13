import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { snackbarError } from 'redux/actions/snackbar';
import UserApi from 'apis/user';
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


class CreateUserDialog extends React.Component {
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
        };
    }

    componentDidMount() {
        this._mountGuard = false;
        this.props.provider({
            show: () => this.setState({showDialog: true}),
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
        const res = await UserApi.create({ user: this._userForm.getData()});
        if(this._mountGuard) return;

        this.setState({ sending: false });
        if (res.status === 200) {
            this.props.cb(res.json);
            this._userForm.reset();
            this.setState({ showDialog: false });
        }
        else if (res.status === 400) {
            this.setState({validation: res});
        }
        else {
            console.log(res);
            this.props.snackbarError("Error on creating User");
        }
    }

    render() {
        return (
            <Dialog
                id="create-user-dialog"
                open={this.state.showDialog}
                onClose={evt => this.setState({showDialog: false})}
            >
                <LinearProgress style={{position: "absolute", zIndex: 1}} id="create-user-progress-bar" closed={!this.state.sending}/>
                <DialogTitle>Create User</DialogTitle>
                <DialogContent id="dialog-content">
                    <UserForm
                        id="user-form"
                        provider={provide => this._userForm = provide}
                        validation={this.state.validation}
                        onSubmit={this.submit} />
                </DialogContent>
                <DialogActions>
                    <DialogButton action="close">Cancel</DialogButton>
                    <div style={{flex: 1}}></div>
                    <Button raised disabled={this.state.sending} type="submit" form="user-form">Create</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapDispatchToProps = { snackbarError };
export default connect(null, mapDispatchToProps)(CreateUserDialog);