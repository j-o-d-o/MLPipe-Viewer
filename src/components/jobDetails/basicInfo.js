import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { NavLink } from 'react-router-dom';
import JobData from 'utils/processJobData.util';
import { LinearProgress } from '@rmwc/linear-progress';
import { Grid, GridCell } from '@rmwc/grid';


class BasicInfo extends React.Component {
    static propTypes = {
        job: PropTypes.object.isRequired,
        exp: PropTypes.object,
    }
    static defaultProps = {
        exp: null
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const job = this.props.job;
        const exp = this.props.exp;
        let progress = 0;
        let expStatus = "No status";
        let trainingStarted = "";
        if (exp !== null) {
            expStatus = JobData.getExpStatus(exp);
            progress = JobData.getProgress(exp);
            trainingStarted = dayjs(exp.createdAt).format("YYYY-MM-DD H:mm:s");
        }

        return (
            <Grid id="job-details-top-row">
                <GridCell span={6} id="job-details-fields">
                    <div><span className="field-info">Type:</span> {JobData.resolveType(job.type)}</div>
                    <div><span className="field-info">Description:</span> {job.description}</div>
                    <div><span className="field-info">Job Status:</span> {JobData.getJobStatus(job.is_finished, job.in_error)}</div>
                    <div><span className="field-info">Job created:</span> {dayjs(job.createdAt).format("YYYY-MM-DD H:mm:s")}</div>
                    <div><span className="field-info">Training started:</span> {trainingStarted}</div>
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
        );
    }
}

export default BasicInfo;