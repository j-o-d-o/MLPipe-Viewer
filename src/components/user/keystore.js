import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import {snackbarError} from 'redux/actions/snackbar';
import {connect} from 'react-redux';
import KeystoreApi from 'apis/keystore';
import CreateKeysDialog from './createKeys.dialog';
import PublicKeyDialog from './publicKey.dialog';
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
        this._publicKeyDialog = {};
        this._mountGuard = true;

        this.state = {
            keys: [],
            showLoading: false,
        };
    }

    async componentDidMount() {
        this._mountGuard = false;
        this.setState({showLoading: true});
        const res = await KeystoreApi.get(this.props.userId);
        if (this._mountGuard) return;
        this.setState({showLoading: false});
        if (res.status === 200) {
            this.setState({keys: res.json});
        } 
        else {
            console.log(res);
            this.props.snackbarError("Error on getting Keys");
        }
    }

    componentWillUnmount() { 
        this._mountGuard = true; 
    }

    deleteKey = async (keyId) => {
        // TODO: show confirm dialog before deleting keys
        this.setState({showLoading: true});
        const res = await KeystoreApi.delete(keyId);
        if (this._mountGuard) return;
        this.setState({showLoading: false});
        if (res.status === 200) {
            const keyArr = this.state.keys.filter( ele => ele._id !== keyId);
            this.setState({ keys: keyArr });
        }
        else {
            console.log(res);
            this.props.snackbarError("Error on deleting Key");
        }
    }

    render() {
        const keys = this.state.keys;

        let tableRows = [];
        for(let i = 0; i < keys.length; ++i ){
            tableRows.push((
                <DataTableRow key={"key-" + keys[i]._id}>
                    <DataTableCell>{keys[i].name}</DataTableCell>
                    <DataTableCell>{dayjs(keys[i].createdAt).format("YYYY-MM-DD H:mm:s")}</DataTableCell>
                    <DataTableCell>
                        <Button onClick={() => this._publicKeyDialog.show(keys[i].public_key, keys[i].name)}>Download</Button>
                    </DataTableCell>
                    <DataTableCell><Button onClick={() => this.deleteKey(keys[i]._id)}>Delete</Button></DataTableCell>
                </DataTableRow>
            ));
        }

        return (
            <div id="keystore-component">
                <h4>Keystore</h4>
                { keys.length > 0 &&
                    <DataTable>
                        <LinearProgress style={{position: "absolute", zIndex: 1}} closed={!this.state.showLoading}/>
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
                            </DataTableBody>
                        </DataTableContent>
                    </DataTable>
                }
                <Button style={{display: "block"}} onClick={this._createKeysDialog.show}>Create New Key</Button>

                <CreateKeysDialog 
                    provider={provide => this._createKeysDialog = provide}
                    onCreated={newKey => this.setState( prevState => ({ keys: [newKey, ...prevState.keys ]}))}
                />

                <PublicKeyDialog
                    provider={provide => this._publicKeyDialog = provide}
                />
            </div>
        );
    }
}

const mapDispatchToProps = { snackbarError };

export default connect(null, mapDispatchToProps)(Keystore);