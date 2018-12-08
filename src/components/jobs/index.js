import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import moment from 'moment';
import { snackbarError } from 'redux/actions/snackbar';
import JobApi from 'apis/job';
import { Button } from '@rmwc/button';
import CreateJobDialog from './createJob.dialog';
import { Toolbar, ToolbarRow, ToolbarTitle} from '@rmwc/toolbar';
import { Ripple } from '@rmwc/ripple';
import { Menu, MenuItem, MenuSurfaceAnchor } from '@rmwc/menu';
import {
    DataTable,
    DataTableContent,
    DataTableHead,
    DataTableBody,
    DataTableHeadCell,
    DataTableRow,
    DataTableCell
} from '@rmwc/data-table';


class Jobs extends React.Component {
    static propTypes = {
        snackbarError: PropTypes.func.isRequired,
        showLoading: PropTypes.func.isRequired,
        hideLoading: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
        this._mountGuard = true;
        this._createJobDialog = {};

        this.state = {
            activeTab: 0,
            jobs: [],
            openMenuByJobId: null,
        };
    }

    async componentWillMount() {
        this._mountGuard = false;
        this.props.showLoading();

        const res = await JobApi.getList();
        if(this._mountGuard) return;

        this.props.hideLoading();
        if (res.status === 200) {
            this.setState({ jobs: res.json });
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

    componentDidMount() {
        this._createJobDialog.show();
    }

    render() {
        const jobs = this.state.jobs;

        let tableRows = [];
        for(let i = 0; i < jobs.length; i++ ){
            tableRows.push((
                <DataTableBody key={"job-" + jobs[i]._id}>
                    <DataTableRow>
                        <DataTableCell alignEnd>{jobs[i].is_finished}</DataTableCell>
                        <DataTableCell>{jobs[i].name}</DataTableCell>
                        <DataTableCell>{jobs[i].creator}</DataTableCell>
                        <DataTableCell alignEnd>{jobs[i].type}</DataTableCell>
                        <DataTableCell alignEnd>{moment(jobs[i].createdAt).format("YYYY-MM-DD H:mm:s")}</DataTableCell>
                        <DataTableCell alignMiddle>
                            <MenuSurfaceAnchor>
                                <Menu
                                    fixed
                                    anchorCorner="topLeft"
                                    open={this.state.openMenuByJobId === jobs[i]._id}
                                    onClose={evt => this.setState({openMenuByJobId: null})}
                                >
                                    <MenuItem onClick={evt => alert("Not implemented")}>View</MenuItem>
                                    <MenuItem onClick={evt => alert("Not implemented")}>Delete</MenuItem>
                                    <MenuItem onClick={evt => alert("Not implemented")}>Edit</MenuItem>
                                </Menu>
                                <Ripple primary>
                                    <i className="material-icons open-menu" onClick={evt => this.setState({openMenuByJobId: jobs[i]._id})}>more_vert</i>
                                </Ripple>
                            </MenuSurfaceAnchor>
                        </DataTableCell>
                    </DataTableRow>
                </DataTableBody>
            ));
        }

        return (
            <div id="jobs-page" className="flex-content">
                <div id="jobs-content">
                    <Toolbar>
                        <ToolbarRow id="toolbar-row">
                            <ToolbarTitle>Training Jobs</ToolbarTitle>
                            <Button raised type="button" id="create-job-btn" onClick={this._createJobDialog.show}>Create Job</Button>
                        </ToolbarRow>
                    </Toolbar>

                    <DataTable id="jobs-table">
                        <DataTableContent id="jobs-table--content">
                            <DataTableHead>
                                <DataTableRow>
                                    <DataTableHeadCell>Status</DataTableHeadCell>
                                    <DataTableHeadCell>Name</DataTableHeadCell>
                                    <DataTableHeadCell>User</DataTableHeadCell>
                                    <DataTableHeadCell alignEnd>Type</DataTableHeadCell>
                                    <DataTableHeadCell alignEnd>Created At</DataTableHeadCell>
                                    <DataTableHeadCell alignMiddle></DataTableHeadCell>
                                </DataTableRow>
                            </DataTableHead>
                            {tableRows}
                        </DataTableContent>
                    </DataTable>
                </div>

                <CreateJobDialog provideCtrl={ctrl => this._createJobDialog = ctrl} />
            </div>
        );
    }
}

const mapDispatchToProps = { snackbarError, showLoading, hideLoading};

export default connect(null, mapDispatchToProps)(Jobs);