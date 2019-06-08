import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { snackbarError } from 'redux/actions/snackbar';
import JobApi from 'apis/job';
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
        switch(this.state.activeTab) {
            case 0:
                tabContent = <RemoteJobForm
                                id="job-form"
                                provider={provide => this._remoteForm = provide}
                                validation={this.state.validation}
                                onSubmit={e => this.submit(e, "remote")} />
                break;
            case 1:
                tabContent = <LocalJobForm
                                id="job-form"
                                provider={provide => this._localForm = provide} 
                                validation={this.state.validation} 
                                onSubmit={e => this.submit(e, "local")} />
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
                    <Button raised disabled={this.state.sending} type="submit" form="job-form">Create</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapDispatchToProps = { snackbarError };
export default connect(null, mapDispatchToProps)(CreateJobDialog);