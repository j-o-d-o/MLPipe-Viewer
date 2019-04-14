import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { snackbarError, snackbarInfo } from 'redux/actions/snackbar';
import JobApi from 'apis/job';
import { LinearProgress } from '@rmwc/linear-progress';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogButton
} from '@rmwc/dialog';


class GetJobToken extends React.Component {
    static propTypes = {
        snackbarError: PropTypes.func.isRequired,
        jobId: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props);
        this._mountGuard = true;

        this.state = {
            showDialog: false,
            sending: false,
            token: null,
        };
    }

    componentDidMount() {
        this._mountGuard = false;
        this.props.provider({
            show: () => {
                this.setState({showDialog: true});
                // Load the token
                this.getToken();
            }
        });
    }
    componentWillUnmount() {
        this._mountGuard = true;
        this.props.provider(null);
    }

    getToken = async (evt) => {
        if(this.state.sending) return;

        this.setState({ sending: true, validation: null });
        const res = await JobApi.getJobToken(this.props.jobId);
        if(this._mountGuard) return;

        this.setState({ sending: false });
        if (res.status === 200) {
            // Redirect to jobs detail page
            this.setState({ token: res.json.token });
        }
        else if (res.status === 400) {
            this.setState({validation: res});
        }
        else if (res.status === 401 || res.status === 403) {
            this.props.snackbarError("Not Authorized to get this Token");
            this.setState({ showDialog: false });
        }
        else {
            console.log(res);
            this.props.snackbarError("Error on getting Token");
        }
    }

    copytoClipboard = (evt) => {
        // TODO: implement this... probably with a hidden input
        this.props.snackbarInfo("Copied to Clipboard");
        this.setState({ showDialog: false });
    }

    render() {
        return (
            <Dialog
                id="get-job-token"
                open={this.state.showDialog}
                onClose={evt => this.setState({showDialog: false})}
            >
                <LinearProgress style={{position: "absolute", zIndex: 1}} id="login-progress-bar" closed={!this.state.sending}/>
                <DialogTitle>Job Token</DialogTitle>
                <DialogContent id="dialog-content">
                    <div id="token-value">
                        {this.state.token !== null ? this.state.token : ""}
                    </div>
                    {this.state.token !== null &&
                        <div id="token-info">
                            Copy the token to your config.ini file to they 'job_token' key
                        </div>
                    }
                </DialogContent>
                <DialogActions>
                    <DialogButton action="close">Cancel</DialogButton>
                    <div style={{flex: 1}}></div>
                    <DialogButton isDefaultAction disabled={this.state.sending || this.state.token === null} 
                    type="button" onClick={this.copytoClipboard}>Copy to Clipboard</DialogButton>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapDispatchToProps = { snackbarError, snackbarInfo };
export default connect(null, mapDispatchToProps)(GetJobToken);