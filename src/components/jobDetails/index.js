import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
//import moment from 'moment';
import { snackbarError } from 'redux/actions/snackbar';
import JobApi from 'apis/job';
import GetJobToken from './getJobToken.dialog';
import { Button } from '@rmwc/button';
import { Toolbar, ToolbarRow, ToolbarTitle} from '@rmwc/toolbar';


class Jobs extends React.Component {
    static propTypes = {
        snackbarError: PropTypes.func.isRequired,
        showLoading: PropTypes.func.isRequired,
        hideLoading: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
        this._mountGuard = true;

        this.state = {
            job: null,
        };
    }

    async componentWillMount() {
        this._mountGuard = false;
        this.props.showLoading();

        const res = await JobApi.get(this.props.match.params.job);
        if(this._mountGuard) return;

        this.props.hideLoading();
        if (res.status === 200) {
            this.setState({ job: res.json });
        }
        else {
            console.log(res);
            this.props.snackbarError("Error on getting Job List");
        }
    }
    componentWillUnmount() {
        this._mountGuard = true;
        this.props.hideLoading();
    }

    buildContent = () => {
        const job = this.state.job;
        if(job === null) {
            return (
                <div id="job-details-wrapper">
                    Loading...
                </div>
            );
        }
        else if(job.experiments.length > 0) {
            // For now, assuming there is a 1:1 mapping for experiments and jobs
            // const experiment = job.experiments[0];
            return (
                <div id="job-details-wrapper">
                    Show experiment details
                </div>
            )
        }
        else {
            return (
                <div id="job-details-wrapper" style={{ padding: "40px"}}>
                    No experiment exists for this Job, you can train one with the job token.
                </div>
            )
        }
    }

    render() {
        const job = this.state.job;

        return (
            <div id="job-details-page" className="flex-content">
                <div id="job-details-content">
                    <Toolbar>
                        <ToolbarRow id="toolbar-row">
                            <ToolbarTitle>{ job != null ? job.name : ""}</ToolbarTitle>
                        </ToolbarRow>
                    </Toolbar>
                    <div>
                        <div id="action-menu">
                            <Button disabled={job === null} className="action-btn" onClick={() => alert("Not implemented")}>edit</Button>
                            <Button disabled={job === null} className="action-btn" onClick={() => alert("Not implemented")}>delete</Button>
                            <Button disabled={job === null} className="action-btn" onClick={() => this._getJobToken.show()}>get token</Button>
                        </div>
                        <div>
                            {this.buildContent()}
                        </div>
                    </div>
                </div>

                {job !== null && 
                    <GetJobToken
                        jobId={job._id}
                        provider={provide => this._getJobToken = provide}
                    />
                }
            </div>
        );
    }
}

const mapDispatchToProps = { snackbarError, showLoading, hideLoading};

export default connect(null, mapDispatchToProps)(Jobs);