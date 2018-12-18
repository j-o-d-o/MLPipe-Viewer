import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import {snackbarError} from 'redux/actions/snackbar';
import {connect} from 'react-redux';
import KeystoreApi from 'apis/keystore';
import CreateKeysDialog from './createKeys.dialog';
import { Button } from '@rmwc/button';
import { LinearProgress } from '@rmwc/linear-progress';
import {
    DataTable,
    DataTableContent,
    DataTableHead,
    DataTableBody,
    DataTableHeadCell,
    DataTableRow,
    DataTableCell
} from '@rmwc/data-table';


class Keystore extends React.Component {
    static propTypes = {
        userId: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props);
        this._createKeysDialog = {};
        this._mountGuard = true;

        this.state = {
        keys: [],
            showLoading: false,
        };
    }

    async componentWillMount() {
        this._mountGuard = false;
        this.setState({showLoading: true});
        const res = await KeystoreApi.get(this.props.userId);
        if (this._mountGuard) return;
        this.setState({showLoading: false});
        if (res.status === 200) {
            this.setState({keys: res.json});
        } else {
            console.log(res);
            this.props.snackbarError("Error on getting Keys");
        }
    }

    componentWillUnmount() { 
        this._mountGuard = true; 
    }

  render() {
        const keys = this.state.keys;
        console.log(keys);

        let tableRows = [];
        for(let i = 0; i < keys.length; ++i ){
            tableRows.push((
                <DataTableRow key={"key-" + keys[i]._id}>
                    <DataTableCell>{keys[i].name}</DataTableCell>
                    <DataTableCell>{dayjs(keys[i].createdAt).format("YYYY-MM-DD H:mm:s")}</DataTableCell>
                    <DataTableCell><Button>Download Public Key</Button></DataTableCell>
                    <DataTableCell><Button>Delete</Button></DataTableCell>
                </DataTableRow>
            ));
        }

        return (
            <div id="keystore-component">
                <h4>Keystore</h4>
                
                <DataTable>
                    <LinearProgress style={{position: "absolute", zIndex: 1}} determinate={false} closed={!this.state.showLoading}/>
                    <DataTableContent id="keystore-table-content">
                        <DataTableHead>
                            <DataTableRow>
                                <DataTableHeadCell>Name</DataTableHeadCell>
                                <DataTableHeadCell>Created At</DataTableHeadCell>
                                <DataTableHeadCell></DataTableHeadCell>
                                <DataTableHeadCell></DataTableHeadCell>
                            </DataTableRow>
                        </DataTableHead>
                        <DataTableBody>
                            {tableRows}
                            <DataTableRow>
                                <DataTableCell colSpan={4}>
                                    <Button onClick={this._createKeysDialog.show}>Create New Key</Button>
                                </DataTableCell>
                            </DataTableRow>
                        </DataTableBody>
                    </DataTableContent>
                </DataTable>

                <CreateKeysDialog 
                    provider={provide => this._createKeysDialog = provide}
                />
            </div>
        );
    }
}

const mapDispatchToProps = { snackbarError };

export default connect(null, mapDispatchToProps)(Keystore);