import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { snackbarError } from 'redux/actions/snackbar';
import JobApi from 'apis/job';
import GetJobToken from './getJobToken.dialog';
import PlotMetric from './plotMetric';
import DisplayLog from './displayLog';
import { Button } from '@rmwc/button';
import { Select } from '@rmwc/select';
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
            showMetric: null,
        };
    }

    async componentWillMount() {
        this._mountGuard = false;
        this.props.showLoading();

        const res = await JobApi.get(this.props.match.params.job);
        if(this._mountGuard) return;

        this.props.hideLoading();
        if (res.status === 200) {
            // Chose first metric as default value for showMetric
            let showMetric = "";
            if (res.json.experiments.length > 0) {
                const experiment = res.json.experiments[0]; // assuming a 1:1 mapping
                const objectKeys = Object.keys(experiment.metrics.training);
                if(objectKeys.length > 0) {
                    showMetric = objectKeys[0];
                }
            }
            this.setState({ 
                job: res.json,
                showMetric,
            });
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
            return <div id="job-details-wrapper"></div>;
        }
        else if(job.experiments.length > 0) {
            // For now, assuming there is a 1:1 mapping for experiments and jobs
            // TODO: extend this for AWS jobs
            const exp = job.experiments[0];
            const metricOptions = Object.keys(exp.metrics.training);
            const typeTable = { 0: "Local", 1: "AWS"};
            return (
                <div id="job-details-wrapper">
                    <div id="job-details-fields">
                        <div><span className="field-info">Status:</span> Trained</div>
                        <div><span className="field-info">Type:</span> {typeTable[job.type]}</div>
                        <div><span className="field-info">Job created:</span> {dayjs(job.createdAt).format("YYYY-MM-DD H:mm:s")}</div>
                        <div><span className="field-info">Training started:</span> {dayjs(exp.createdAt).format("YYYY-MM-DD H:mm:s")}</div>
                        <div><span className="field-info">Creator:</span> {job.creator.name}</div>
                    </div>
                    {/* TODO: job.setup_log */}
                    <DisplayLog log={exp.log} name="Experiment Log" />
                    {metricOptions.length > 0 ? 
                        <div id="metrics-wrapper">
                            <Select
                                id="select-metric"
                                label="Select Metric"
                                onChange={evt => this.setState({ showMetric: evt.target.value })}
                                value={this.state.showMetric}
                                options={metricOptions}
                            />
                            <PlotMetric validationData={[1, 2, 3]} trainingData={[2,3,4]} name={"TEST"}/>
                        </div>
                    :
                        <div id="metrics-wrapper">
                            No Metrics available
                        </div>
                    }
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