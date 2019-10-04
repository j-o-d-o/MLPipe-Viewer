import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { snackbarError, snackbarInfo } from 'redux/actions/snackbar';
import { updateLogged } from 'redux/actions/auth';
import JobApi from 'apis/job';
import UserApi from 'apis/user';
import * as authUtil from 'utils/auth.util';
import LocalJobForm from './localJob.form';
import RemoteJobForm from './remoteJob.form';
import { LinearProgress } from '@rmwc/linear-progress';
import { Button } from '@rmwc/button';
import { TabBar, Tab } from '@rmwc/tabs';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogButton
} from '@rmwc/dialog';


class CreateJobDialog extends React.Component {
    static propTypes = {
        snackbarError: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        this._mountGuard = true;

        this.state = {
            showDialog: false,
            activeTab: 0,
            sending: false,
            sendingDefaultParams: false,
            validation: null,
        };
    }

    componentDidMount() {
        this._mountGuard = false;
        this.props.provider({
            show: () => {
                const defaultParams = authUtil.getUser().default_job_data;
                if(defaultParams !== undefined && defaultParams !== null) {
                    this._remoteForm.setData(defaultParams);
                }
                this.setState({showDialog: true})
            },
        });
    }
    componentWillUnmount() {
        this._mountGuard = true;
        this.props.provider(null);
    }

    saveRemoteDataAsDefault = async (evt, type) => {
        if(this.sendingDefaultParams) return;
        this.setState({ sendingDefaultParams: true });
        const userId = authUtil.getUser()._id;
        const userData = { user: { default_job_data: this._remoteForm.getDataAsObject() }};
        const res = await UserApi.update(userId, userData);
        this.setState({ sendingDefaultParams: false });
        if (res.status === 200) {
            this.props.snackbarInfo("Saved params as default");
            // since we are updating the logged in user, we also need to update the redux store
            this.props.updateLogged(res.json);
        }
        else {
            console.log(res);
            this.props.snackbarError("Error on saving default params");
        }

        if(this._mountGuard) return;
    }

    submit = async (evt, type) => {
        evt.preventDefault();
        if(this.state.sending) return;

        this.setState({ sending: true, validation: null });

        let res;
        if(type === "local") {
            res = await JobApi.createLocal(this._localForm.getData());
        }
        else if(type === "remote") {
            res = await JobApi.createRemote(this._remoteForm.getData());
        }
        else {
            console.log("Unkown type: " + type);
        }
        if(this._mountGuard) return;

        this.setState({ sending: false });
        if (res.status === 200) {
            // Redirect to jobs detail page
            this.props.history.push("/job/" + res.json._id);
        }
        else if (res.status === 400) {
            this.setState({validation: res});
        }
        else {
            console.log(res);
            this.props.snackbarError("Error on creating Job");
        }
    }

    render() {
        let tabContent;
        let type;
        let saveDefaultParamBtn = null;
        switch(this.state.activeTab) {
            case 0:
                type = "remote";
                tabContent = <RemoteJobForm
                                id="job-form"
                                provider={provide => this._remoteForm = provide}
                                validation={this.state.validation}
                                onSubmit={e => this.submit(e, type)} />
                saveDefaultParamBtn = <Button
                    style={{marginRight: "15px"}}
                    disabled={this.state.sendingDefaultParams}
                    onClick={this.saveRemoteDataAsDefault}
                    type="button">
                        Save as Default
                    </Button>
                break;
            case 1:
                type = "local";
                tabContent = <LocalJobForm
                                id="job-form"
                                provider={provide => this._localForm = provide} 
                                validation={this.state.validation} 
                                onSubmit={e => this.submit(e, type)} />
                break;
            default:
                tabContent = "<div>Unkown Tab Index</div>";
        }

        return (
            <Dialog
                id="create-job-dialog"
                open={this.state.showDialog}
                onClose={evt => this.setState({showDialog: false})}
            >
                <LinearProgress style={{position: "absolute", zIndex: 1}} id="create-job-progress-bar" closed={!this.state.sending}/>
                <DialogTitle>Create Job</DialogTitle>
                <DialogContent id="dialog-content">
                    <TabBar
                        activeTabIndex={this.state.activeTab}
                        onActivate={evt => this.setState({activeTab: evt.detail.index, validation: null})}
                    >
                        <Tab>Remote</Tab>
                        <Tab>Local</Tab>
                    </TabBar>
                    <div id="tab-content">
                        {tabContent}
                    </div>
                </DialogContent>
                <DialogActions>
                    <DialogButton action="close">Cancel</DialogButton>
                    <div style={{flex: 1}}></div>
                    {saveDefaultParamBtn}
                    <Button raised disabled={this.state.sending} type="submit" form="job-form">Create</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapDispatchToProps = { updateLogged, snackbarInfo, snackbarError };
export default connect(null, mapDispatchToProps)(CreateJobDialog);