import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { snackbarResetError, snackbarResetInfo } from 'redux/actions/snackbar';
import Header from 'components/header';
import { Snackbar, SnackbarAction } from '@rmwc/snackbar';


class Layout extends React.Component {
    static propTypes = {
        error_msg: PropTypes.string.isRequired,
        info_msg: PropTypes.string.isRequired,
        snackbarResetError: PropTypes.func.isRequired,
        snackbarResetInfo: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            showErrorSnackbar: false,
            showInfoSnackbar: false,
            errorMsg: "",
            infoMsg: "",
        }

        this.onHideError = this.onHideError.bind(this);
        this.onHideInfo = this.onHideInfo.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const currErrorMsg = this.props.error_msg;
        const currInfoMsg = this.props.info_msg;
        const prevErrorMsg = prevProps.error_msg;
        const prevInfoMsg = prevProps.info_msg;

        if (currErrorMsg !== "" && prevErrorMsg !== currErrorMsg) {
            this.setState({ showErrorSnackbar: true, errorMsg: currErrorMsg});
        }

        if (currInfoMsg !== "" && prevInfoMsg !== currInfoMsg) {
            this.setState({ showInfoSnackbar: true, infoMsg: currInfoMsg});
        }
    }

    onHideError() {
        this.setState({ showErrorSnackbar: false });
        this.props.snackbarResetError();
    }

    onHideInfo() {
        this.setState({ showInfoSnackbar: false });
        this.props.snackbarResetInfo();
    }

    render(){
        return(
            <section id="layout">
                <Header />
                
                <div id="layout-content">
                    {this.props.children}
                </div>

                <Snackbar
                    id="error-snackbar"
                    open={this.state.showErrorSnackbar}
                    onClose={this.onHideError}
                    message={this.state.errorMsg}
                    action={[<SnackbarAction label="X" />]}
                />

                <Snackbar
                    id="info-snackbar"
                    open={this.state.showInfoSnackbar}
                    onClose={this.onHideInfo}
                    message={this.state.infoMsg}
                    action={[<SnackbarAction label="X" />]}
                />
            </section>
        ); 
    }
}

const mapStateToProps = (state) => ({ 
    error_msg: state.snackbar.get('error_msg'),
    info_msg: state.snackbar.get('info_msg') 
});
const mapDispatchToProps = {snackbarResetError, snackbarResetInfo};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout))