import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { snackbarError } from 'redux/actions/snackbar';
import JobApi from 'apis/job';
import PlotMetric from './plotMetric';
import DisplayLog from './displayLog';
import BasicInfo from './basicInfo';
import JobToolbar from './jobToolbar';
import JobData from 'utils/processJobData.util';
import { Select } from '@rmwc/select';
import { Button } from '@rmwc/button';


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
            const showMetric = this.getDefaultMeric(res.json, this.state.showMetric);
            this.setState({
                job: res.json,
                showMetric
            });
            // depending on the current exp status, chose timeout length
            if(res.json.trainings.length > 0){
                const status = res.json.trainings[0].status;
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

    async componentDidMount() {
        this._mountGuard = false;
        this.props.showLoading();

        const res = await JobApi.get(this.props.match.params.job);
        if(this._mountGuard) return;

        this.props.hideLoading();
        if (res.status === 200) {
            const showMetric = this.getDefaultMeric(res.json, this.state.showMetric);
            this.setState({ 
                job: res.json,
                showMetric,
            });

            // Wait 3 seconds and start poll
            setTimeout(this.pollJob, 3200);
        }
        else if (res.status === 404) {
            this.props.history.push("/404_not_found")
        }
        else {
            console.log(res);
            this.props.snackbarError("Error on getting Job");
        }
    }
    componentWillUnmount() {
        this._mountGuard = true;
        this.props.hideLoading();
    }

    // Get first metric from the metrices, if it is already set, choose that one
    getDefaultMeric = (job, currentMetric) => {
        if(currentMetric !== null && currentMetric !== "")
            return currentMetric;
        let showMetric = null;
        if (job.trainings.length > 0) {
            const training = job.trainings[0]; // assuming a 1:1 mapping
            if(training.metrics !== undefined) {
                const objectKeys = Object.keys(training.metrics.training);
                if(objectKeys.length > 0) {
                    showMetric = objectKeys[0];
                }
            }
        }
        return showMetric;
    }

    buildContent = () => {
        const job = this.state.job;
        if(job === null)
            return <div id="job-details-wrapper"></div>;

        // In case no trainings exist just yet, just show the job info pannel
        if(job.trainings.length === 0) {
            return (
                <div id="job-details-wrapper">
                    <BasicInfo job={job} />
                    <DisplayLog log={job.setup_log.join("")} name="Job Setup Log" />
                    <div style={{textAlign: "center"}}>No training exists for this Job yet</div>
                </div>
            );
        }

        if(job.trainings.length > 1)
            console.log("WARNING: for the job " + job._id + " exist more than 1 training!" );

        // For now, assuming there is a 1:1 mapping for trainings and jobs
        const exp = job.trainings[0];
        const metricOptions = JobData.getMetricKeys(exp);
        const trainingData = JobData.getTrainingMetricValues(exp, this.state.showMetric);
        const validationData = JobData.getValidationMetricValues(exp, this.state.showMetric);

        return (
            <div id="job-details-wrapper">
                <BasicInfo job={job} exp={exp} />
                <DisplayLog log={job.setup_log.join("")} name="Job Setup Log" />
                <DisplayLog log={exp.log} name="Training Log" />

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
                        <PlotMetric expId={exp._id} validationData={validationData} trainingData={trainingData} name={this.state.showMetric}/>
                    </div>
                :
                    <div id="metrics-wrapper">
                        No Metrics available
                    </div>
                }

                <Button
                    style={{marginLeft: "50px"}}
                    onClick={() => JobApi.downloadModel(
                        exp._id,
                        exp.weights[exp.weights.length - 1].epoch, 
                        exp.weights[exp.weights.length - 1].batch)}>
                    
                    Download
                </Button>
            </div>
        )
    }

    render() {
        const job = this.state.job;

        return (
            <div id="job-details-page" className="flex-content">
                <div id="job-details-content">
                    <JobToolbar job={job} history={this.props.history} />
                    {this.buildContent()}
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = { snackbarError, showLoading, hideLoading};

export default connect(null, mapDispatchToProps)(JobDetails);