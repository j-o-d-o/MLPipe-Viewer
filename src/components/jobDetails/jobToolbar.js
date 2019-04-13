import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { snackbarError } from 'redux/actions/snackbar';
import JobApi from 'apis/job';
import GetJobToken from './getJobToken.dialog';
import { Toolbar, ToolbarRow, ToolbarTitle} from '@rmwc/toolbar';
import { Button } from '@rmwc/button';


class JobToolbar extends React.Component {
    static propTypes = {
        job: PropTypes.object,
        history: PropTypes.object.isRequired,
    }
    static defaultProps = {
        job: null,
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    deleteJob = async (evt, jobId) => {
        evt.preventDefault();
        this._mountGuard = false;
        this.props.showLoading();

        const res = await JobApi.delete(jobId);
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

    render() {
        const job = this.props.job;
        return (
            <React.Fragment>
                <Toolbar>
                    <ToolbarRow id="toolbar-row">
                        <ToolbarTitle>{ job != null ? job.name : ""}</ToolbarTitle>
                        <div style={{flex: 1}}></div>
                        <Button disabled={job === null} className="action-btn" onClick={(evt) => this.deleteJob(evt, job._id)}>delete</Button>
                        <Button disabled={job === null} className="action-btn" onClick={() => this._getJobToken.show()}>get token</Button>
                    </ToolbarRow>
                </Toolbar>

                {job !== null && 
                    <GetJobToken
                        jobId={job._id}
                        provider={provide => this._getJobToken = provide}
                    />
                }
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = { snackbarError, showLoading, hideLoading};

export default connect(null, mapDispatchToProps)(JobToolbar);