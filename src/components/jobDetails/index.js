import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { snackbarError } from 'redux/actions/snackbar';
import JobApi from 'apis/job';
import { NavLink } from 'react-router-dom';
import GetJobToken from './getJobToken.dialog';
import PlotMetric from './plotMetric';
import DisplayLog from './displayLog';
import JobData from 'utils/processJobData.util';
import { Button } from '@rmwc/button';
import { Select } from '@rmwc/select';
import { Toolbar, ToolbarRow, ToolbarTitle} from '@rmwc/toolbar';
import { LinearProgress } from '@rmwc/linear-progress';
import { Grid, GridCell } from '@rmwc/grid';


class JobDetails extends React.Component {
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

    pollJob = async () => {
        // TODO: ideally exchange this logic with websockets connection to the server
        if(this._mountGuard) return;
        const res = await JobApi.get(this.props.match.params.job);
        if(this._mountGuard) return;
        if (res.status === 200){
            let timeout = 7000;
            this.setState({
                job: res.json,
            });
            // depending on the current exp status, chose timeout length
            if(res.json.experiments.length > 0){
                const status = res.json.experiments[0].status;
                if(status === -1 || status === 100 || status === 200) {
                    // currently epxeriment is training or testing, thus shorten interval
                    timeout = 3200;
                }
                else {
                    timeout = 16000;
                }
            }
            setTimeout(this.pollJob, timeout);
        }
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

            // Wait 3 seconds and start poll
            setTimeout(this.pollJob, 3200);
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

    deleteJob = async (evt, jobId) => {
        evt.preventDefault();
        this._mountGuard = false;
        this.props.showLoading();

        const res = await JobApi.delete(this.props.match.params.job);
        if(this._mountGuard) return;

        this.props.hideLoading();
        if (res.status === 200) {
            // Redirect to the jobs page
            this.props.history.push("/job");
        }
        else {
            console.log(res);
            this.props.snackbarError("Error on deleting Job");
        }
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
            const metricOptions = JobData.getMetricKeys(exp);
            const trainingData = JobData.getTrainingMetricValues(exp, this.state.showMetric);
            const validationData = JobData.getValidationMetricValues(exp, this.state.showMetric);
            const expStatus = JobData.getExpStatus(exp);
            const progress = JobData.getProgress(exp);

            return (
                <div id="job-details-wrapper">
                    <Grid id="job-details-top-row">
                        <GridCell span={6} id="job-details-fields">
                            {/* <div><span className="field-info">Status:</span> Trained</div> */}
                            <div><span className="field-info">Type:</span> {JobData.resolveType(job.type)}</div>
                            <div><span className="field-info">Job created:</span> {dayjs(job.createdAt).format("YYYY-MM-DD H:mm:s")}</div>
                            <div><span className="field-info">Training started:</span> {dayjs(exp.createdAt).format("YYYY-MM-DD H:mm:s")}</div>
                            <div><span className="field-info">Creator:</span> 
                                <NavLink className="user-details-link" exact to={"/user/" + job.creator._id}>{job.creator.name}</NavLink>
                            </div>
                        </GridCell>
                        <GridCell span={6} id="job-details-progress">
                            <LinearProgress progress={progress}/>
                            <div id="progress-number">{(progress * 100).toFixed(0)} %</div>
                            <div id="status-info">STATUS: {expStatus}</div>
                        </GridCell>
                    </Grid>
                    {/* TODO: job.setup_log */}
                    <DisplayLog log={exp.log} name="Experiment Log" />
                    {metricOptions.length > 0 ? 
                        <div id="metrics-wrapper">
                            <Select
                                enhanced
                                id="select-metric"
                                label="Select Metric"
                                onChange={evt => this.setState({ showMetric: evt.target.value })}
                                value={this.state.showMetric}
                                options={metricOptions}
                            />
                            <PlotMetric validationData={validationData} trainingData={trainingData} name={this.state.showMetric}/>
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
                    <Grid id="job-details-top-row">
                        <GridCell span={6} id="job-details-fields">
                            {/* <div><span className="field-info">Status:</span> Trained</div> */}
                            <div><span className="field-info">Type:</span> {JobData.resolveType(job.type)}</div>
                            <div><span className="field-info">Job created:</span> {dayjs(job.createdAt).format("YYYY-MM-DD H:mm:s")}</div>
                            <div><span className="field-info">Creator:</span> 
                                <NavLink className="user-details-link" exact to={"/user/" + job.creator._id}>{job.creator.name}</NavLink>
                            </div>
                        </GridCell>
                    </Grid>
                    <div style={{textAlign: "center"}}>
                        No experiment exists for this Job yet
                    </div>
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
                            <Button disabled={job === null} className="action-btn" onClick={(evt) => this.deleteJob(evt, job._id)}>delete</Button>
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

export default connect(null, mapDispatchToProps)(JobDetails);