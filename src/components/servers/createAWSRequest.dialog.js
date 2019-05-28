import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { snackbarError } from 'redux/actions/snackbar';
import ServerApi from 'apis/server';
import AWSRequestForm from './awsRequest.form';
import { LinearProgress } from '@rmwc/linear-progress';
import { Button } from '@rmwc/button';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogButton
} from '@rmwc/dialog';


class CreateAWSRequestDialog extends React.Component {
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

        const awsConfigData = this._awsRequestForm.getData();

        if(this.state.sending || awsConfigData === false) return;

        this.setState({ sending: true, validation: null });

        const res = await ServerApi.createSpotRequest({ "aws_config": awsConfigData});
        if(this._mountGuard) return;

        this.setState({ sending: false });
        if (res.status === 200) {
            this.props.cb(res.json);
            this._awsRequestForm.reset();
            this.setState({ showDialog: false });
        }
        else if (res.status === 400) {
            this.setState({validation: res});
        }
        else {
            console.log(res);
            this.props.snackbarError("Error on creating AWS Spot Request");
        }
    }

    render() {
        return (
            <Dialog
                id="create-aws-request-dialog"
                open={this.state.showDialog}
                onClose={evt => this.setState({showDialog: false})}
            >
                <LinearProgress style={{position: "absolute", zIndex: 1}} id="create-aws-request-progress-bar" closed={!this.state.sending}/>
                <DialogTitle>Create User</DialogTitle>
                <DialogContent id="dialog-content">
                    <AWSRequestForm
                        id="aws-request-form"
                        provider={provide => this._awsRequestForm = provide}
                        validation={this.state.validation}
                        onSubmit={this.submit} />
                </DialogContent>
                <DialogActions>
                    <DialogButton action="close">Cancel</DialogButton>
                    <div style={{flex: 1}}></div>
                    <Button raised disabled={this.state.sending} type="submit" form="aws-request-form">Create</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapDispatchToProps = { snackbarError };
export default connect(null, mapDispatchToProps)(CreateAWSRequestDialog);