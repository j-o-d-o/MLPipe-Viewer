import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
//import { NavLink } from 'react-router-dom';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import dayjs from 'dayjs';
import { snackbarError, snackbarInfo } from 'redux/actions/snackbar';
import ServerApi from 'apis/server';
import { Button } from '@rmwc/button';
import CreateAWSRequestDialog from './createAWSRequest.dialog';
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


class Servers extends React.Component {
    static propTypes = {
        snackbarError: PropTypes.func.isRequired,
        showLoading: PropTypes.func.isRequired,
        hideLoading: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
        this._mountGuard = true;
        this._createAWSRequestDialog = {};

        this.state = {
            awsRequests: [],
            openMenuById: null,
        };
    }

    async componentDidMount() {
        this._mountGuard = false;
        this.props.showLoading();

        const res = await ServerApi.getRequestList();
        if(this._mountGuard) return;

        this.props.hideLoading();
        if (res.status === 200) {
            this.setState({ awsRequests: res.json });
        }
        else {
            console.log(res);
            this.props.snackbarError("Error on getting AWS Spot Requests");
        }
    }

    componentWillUnmount() {
        this._mountGuard = true;
        this.props.hideLoading();
    }

    cancelRequest = async (requestId) => {
        this._mountGuard = false;
        this.props.showLoading();

        const res = await ServerApi.cancelRequest(requestId);
        if(this._mountGuard) return;

        this.props.hideLoading();
        if (res.status === 200) {
            // TODO: Update that is_canceling is true for the object
            this.props.snackbarInfo("Canceling AWS Request in progress")
        }
        else {
            console.log(res);
            this.props.snackbarError("Error canceling AWS Request");
        }
    }

    getStatus = (request) => {
        if(request.in_error) {
            return "IN ERROR";
        }
        else if(request.is_canceling) {
            return "CANCELING";
        }
        else if(request.is_finished) {
            return "RUNNING";
        }
        else {
            return "SETTING UP";
        }
    }

    render() {
        const awsRequests = this.state.awsRequests;
        let tableRows = [];
        for(let i = 0; i < awsRequests.length; i++ ){
            tableRows.push((
                <DataTableRow key={"awsRequest-" + awsRequests[i]._id}>
                    <DataTableCell>{awsRequests[i].spot_request_id}</DataTableCell>
                    <DataTableCell>{awsRequests[i].instance_ids}</DataTableCell>
                    <DataTableCell>{awsRequests[i].instance_ips}</DataTableCell>
                    <DataTableCell>{this.getStatus(awsRequests[i])}</DataTableCell>
                    <DataTableCell alignEnd>{dayjs(awsRequests[i].createdAt).format("YYYY-MM-DD H:mm:s")}</DataTableCell>
                    <DataTableCell alignMiddle>
                        <MenuSurfaceAnchor>
                            <Menu
                                fixed
                                anchorCorner="topLeft"
                                open={this.state.openMenuById === awsRequests[i]._id}
                                onClose={evt => this.setState({openMenuById: null})}
                            >
                                <MenuItem onClick={evt => this.cancelRequest(awsRequests[i]._id)}>Cancel</MenuItem>
                            </Menu>
                            <Ripple primary>
                                <i className="material-icons open-menu" onClick={evt => this.setState({openMenuById: awsRequests[i]._id})}>more_vert</i>
                            </Ripple>
                        </MenuSurfaceAnchor>
                    </DataTableCell>
                </DataTableRow>
            ));
        }

        return (
            <div id="server-page" className="flex-content">
                <div id="aws-requests-content">
                    <Toolbar>
                        <ToolbarRow id="toolbar-row">
                            <ToolbarTitle>AWS Spot Requests</ToolbarTitle>
                            <Button raised type="button" id="create-spot-request-btn" onClick={this._createAWSRequestDialog.show}>Create Spot Request</Button>
                        </ToolbarRow>
                    </Toolbar>

                    <DataTable id="aws-requests-table">
                        <DataTableContent id="aws-requests-table--content">
                            <DataTableHead>
                                <DataTableRow>
                                    <DataTableHeadCell>Spot Request Id</DataTableHeadCell>
                                    <DataTableHeadCell>Instance Ids</DataTableHeadCell>
                                    <DataTableHeadCell>Instance IPs</DataTableHeadCell>
                                    <DataTableHeadCell>Status</DataTableHeadCell>
                                    <DataTableHeadCell alignEnd>Created At</DataTableHeadCell>
                                    <DataTableHeadCell alignMiddle></DataTableHeadCell>
                                </DataTableRow>
                            </DataTableHead>
                            <DataTableBody >
                                {tableRows}
                            </DataTableBody>
                        </DataTableContent>
                    </DataTable>
                </div>

                <CreateAWSRequestDialog
                    history={this.props.history}
                    provider={provide => this._createAWSRequestDialog = provide}
                    cb={(newRequest) => {
                        this.setState((prevState) => ({
                            awsRequests: [newRequest, ...prevState.awsRequests],
                        }));
                    }}
                />
            </div>
        );
    }
}

const mapDispatchToProps = { snackbarError, snackbarInfo, showLoading, hideLoading};

export default connect(null, mapDispatchToProps)(Servers);