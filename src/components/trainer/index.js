import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { snackbarError } from 'redux/actions/snackbar';
//import TrainApi from 'apis/train';
import { Button } from '@rmwc/button';


class Trainer extends React.Component {
    static propTypes = {
        snackbarError: PropTypes.func.isRequired,
        showLoading: PropTypes.func.isRequired,
        hideLoading: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
        this._mountGuard = true;

        this.state = {};
    }

    componentWillMount() {
        this._mountGuard = false;
    }
    componentWillUnmount() {
        this._mountGuard = true;
        this.props.hideLoading();
    }

    render() {
        return (
            <div id="user-page" className="flex-content">
                <div id="user-content">
                    <h1>Start Training</h1>
                    <Button raised type="button">Start</Button>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = { snackbarError, showLoading, hideLoading};

export default connect(null, mapDispatchToProps)(Trainer);