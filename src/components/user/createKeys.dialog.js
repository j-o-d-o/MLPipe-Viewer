import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { snackbarError } from 'redux/actions/snackbar';
import KeystoreApi from 'apis/keystore';
import Validation from 'components/validation';
import { LinearProgress } from '@rmwc/linear-progress';
import { Button } from '@rmwc/button';
import { TextField } from '@rmwc/textfield';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogButton
} from '@rmwc/dialog';


class CreateKeysDialog extends React.Component {
    static propTypes = {
        snackbarError: PropTypes.func.isRequired,
        onCreated: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this._mountGuard = true;

        this.state = {
            showDialog: false,
            sending: false,
            validation: null,
            keyName: "",
            createdKey: null,
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

    onSubmit = async (evt) => {
        evt.preventDefault();
        if(this.state.sending) return;

        this.setState({ sending: true, validation: null });
        const res = await KeystoreApi.create(this.state.keyName);
        if(this._mountGuard) return;

        this.setState({ sending: false });
        if (res.status === 200) {
            this.props.onCreated(res.json);
            this.setState({ showDialog: false });
        }
        else if (res.status === 400) {
            this.setState({validation: res});
        }
        else {
            console.log(res);
            this.props.snackbarError("Error on creating Keys");
        }
    }

    render() {
        return (
            <Dialog
                id="create-keys-dialog"
                open={this.state.showDialog}
                onClose={evt => this.setState({showDialog: false})}
            >
                <LinearProgress style={{position: "absolute", zIndex: 1}} closed={!this.state.sending}/>
                <DialogTitle>Create Keys</DialogTitle>
                <DialogContent>
                    <form id="keys-form" onSubmit={this.onSubmit}>
                        <Validation data={this.state.validation} />
                        <TextField required label="Name" style={{ width: "300px", marginTop: "10px" }} onChange={e => this.setState({keyName: e.target.value })}/>
                    </form>
                </DialogContent>
                <DialogActions>
                    <DialogButton action="close">Cancel</DialogButton>
                    <div style={{flex: 1}}></div>
                    <Button raised disabled={this.state.sending} type="submit" form="keys-form">Create</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapDispatchToProps = { snackbarError };
export default connect(null, mapDispatchToProps)(CreateKeysDialog);