import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { snackbarError } from 'redux/actions/snackbar';
import JobApi from 'apis/job';
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';
import { TabBar, Tab } from '@rmwc/tabs';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogButton
} from '@rmwc/dialog';


class CreateJobDialog extends React.Component {
    static propTypes = {
        snackbarError: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this._mountGuard = true;
        this._formRef = React.createRef();

        this.state = {
            showDialog: false,
            activeTab: 0,
        };
    }

    async componentWillMount() {
        this._mountGuard = false;
        this.props.provideCtrl({
            show: () => this.setState({showDialog: true}),
        });
    }
    componentWillUnmount() {
        this._mountGuard = true;
        this.props.provideCtrl(null);
    }

    submitLocal = (evt) => {
        evt.preventDefault();
        console.log("submit local");
        console.log(this.state);
    }

    submitAWS = (evt) => {
        evt.preventDefault();
    }

    render() {
        let tabContent;
        let submitFunction = () =>  {};
        switch(this.state.activeTab) {
            case 0:
                submitFunction = this.submitLocal;
                tabContent = (
                    <form id="create-job-form" ref={this._formRef} onSubmit={submitFunction}>
                        <TextField label="bam" />
                    </form>
                );
                break;
            case 1:
                submitFunction = this.submitLocal;
                tabContent = (
                    <form id="create-job-form" ref={this._formRef} onSubmit={submitFunction}>
                        <div style={{padding: "30px", fontSize: "20px"}}>AWS Training not implemented yet</div>
                    </form>
                );
                break;
            default:
                tabContent = "<div>Unkown Tab Index</div>";
        }

        return (
            <Dialog
                id="create-job-dialog"
                open={this.state.showDialog}
                onClose={evt => this.setState({showDialog: false})}
            >
                <DialogTitle>Create Job</DialogTitle>
                <DialogContent id="dialog-content">
                    <TabBar
                        activeTabIndex={this.state.activeTab}
                        onActivate={evt => this.setState({activeTab: evt.detail.index})}
                    >
                        <Tab>Local</Tab>
                        <Tab>AWS</Tab>
                    </TabBar>
                    {tabContent}
                </DialogContent>
                <DialogActions>
                    <DialogButton action="close">Cancel</DialogButton>
                    <div style={{flex: 1}}></div>
                    <Button raised action="button" onClick={submitFunction}>Create</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapDispatchToProps = { snackbarError };
export default connect(null, mapDispatchToProps)(CreateJobDialog);