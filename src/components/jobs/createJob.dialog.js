import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { snackbarError } from 'redux/actions/snackbar';
import JobApi from 'apis/job';
import LocalJobForm from './localJob.form';
import AWSJobForm from './awsJob.form';
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

    componentWillMount() {
        this._mountGuard = false;
        this.props.provider({
            show: () => this.setState({showDialog: true}),
        });
    }
    componentWillUnmount() {
        this._mountGuard = true;
        this.props.provider(null);
    }

    submitLocal = async (evt) => {
        evt.preventDefault();
        if(this.state.sending) return;

        this.setState({ sending: true, validation: null });
        const res = await JobApi.create("local", this._localForm.getData());
        if(this._mountGuard) return;

        this.setState({ sending: false });
        if (res.status === 200) {
            console.log(res);
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

    submitAWS = async (evt) => {
        evt.preventDefault();
        // const data = this._awsForm.getData();
    }

    render() {
        let tabContent;
        switch(this.state.activeTab) {
            case 0:
                tabContent = <LocalJobForm
                                id="job-form"
                                provider={provide => this._localForm = provide} 
                                validation={this.state.validation} 
                                onSubmit={this.submitLocal} />
                break;
            case 1:
                tabContent = <AWSJobForm
                                id="job-form"
                                provider={provide => this._awsForm = provide}
                                validation={this.state.validation}
                                onSubmit={this.submitAWS} />
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
                <LinearProgress style={{position: "absolute", zIndex: 1}} id="login-progress-bar" determinate={false} closed={!this.state.sending}/>
                <DialogTitle>Create Job</DialogTitle>
                <DialogContent id="dialog-content">
                    <TabBar
                        activeTabIndex={this.state.activeTab}
                        onActivate={evt => this.setState({activeTab: evt.detail.index, validation: null})}
                    >
                        <Tab>Local</Tab>
                        <Tab>AWS</Tab>
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