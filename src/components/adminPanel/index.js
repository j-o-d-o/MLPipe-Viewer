import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import dayjs from 'dayjs';
import { snackbarError } from 'redux/actions/snackbar';
import UserApi from 'apis/user';
import { Button } from '@rmwc/button';
import CreateUserDialog from './createUser.dialog';
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


class AdminPanel extends React.Component {
    static propTypes = {
        snackbarError: PropTypes.func.isRequired,
        showLoading: PropTypes.func.isRequired,
        hideLoading: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
        this._mountGuard = true;
        this._createUserDialog = {};

        this.state = {
            users: [],
            openMenuByUserId: null,
        };
    }

    async componentWillMount() {
        this._mountGuard = false;
        this.props.showLoading();

        const res = await UserApi.getList();
        if(this._mountGuard) return;

        this.props.hideLoading();
        if (res.status === 200) {
            this.setState({ users: res.json });
        }
        else {
            console.log(res);
            this.props.snackbarError("Error on getting User List");
        }
    }

    componentWillUnmount() {
        this._mountGuard = true;
        this.props.hideLoading();
    }

    getRole = (user) => {
        if(user == null) return "";

        switch(user.role){
            case 0: return "User";
            case 100: return "Admin";
            default: return "Unkown " + user.role;
        }
    }

    render() {
        const users = this.state.users;
        let tableRows = [];
        for(let i = 0; i < users.length; i++ ){
            tableRows.push((
                <DataTableRow key={"user-" + users[i]._id}>
                    <DataTableCell>
                        <NavLink className="user-details-link" exact to={"/user/" + users[i]._id}>{users[i].name}</NavLink>
                    </DataTableCell>
                    <DataTableCell>{this.getRole(users[i])}</DataTableCell>
                    <DataTableCell alignEnd>{dayjs(users[i].createdAt).format("YYYY-MM-DD H:mm:s")}</DataTableCell>
                    <DataTableCell alignMiddle>
                        <MenuSurfaceAnchor>
                            <Menu
                                fixed
                                anchorCorner="topLeft"
                                open={this.state.openMenuByUserId === users[i]._id}
                                onClose={evt => this.setState({openMenuByUserId: null})}
                            >
                                <MenuItem onClick={evt => alert("Not implemented")}>Edit</MenuItem>
                                <MenuItem onClick={evt => alert("Not implemented")}>Delete</MenuItem>
                            </Menu>
                            <Ripple primary>
                                <i className="material-icons open-menu" onClick={evt => this.setState({openMenuByUserId: users[i]._id})}>more_vert</i>
                            </Ripple>
                        </MenuSurfaceAnchor>
                    </DataTableCell>
                </DataTableRow>
            ));
        }

        return (
            <div id="admin-panel-page" className="flex-content">
                <div id="user-managment-content">
                    <Toolbar>
                        <ToolbarRow id="toolbar-row">
                            <ToolbarTitle>User Managment</ToolbarTitle>
                            <Button raised type="button" id="create-user-btn" onClick={this._createUserDialog.show}>Create User</Button>
                        </ToolbarRow>
                    </Toolbar>

                    <DataTable id="user-table">
                        <DataTableContent id="user-table--content">
                            <DataTableHead>
                                <DataTableRow>
                                    <DataTableHeadCell>Name</DataTableHeadCell>
                                    <DataTableHeadCell>Role</DataTableHeadCell>
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

                <CreateUserDialog
                    history={this.props.history}
                    provider={provide => this._createUserDialog = provide}
                    cb={(newUser) => {
                        this.setState((prevState) => ({
                            users: [newUser, ...prevState.users],
                        }));
                    }}
                />
            </div>
        );
    }
}

const mapDispatchToProps = { snackbarError, showLoading, hideLoading};

export default connect(null, mapDispatchToProps)(AdminPanel);