import React from 'react';
import PropTypes from 'prop-types';
// import { TextField } from '@rmwc/textfield';


class AWSJobForm extends React.Component {
    static propTypes = {
        onSubmit: PropTypes.func,
        provider: PropTypes.func,
    }
    static defaultProps = {
        onSubmit: (evt) => evt.preventDefault(),
        provider: () => {},
    }

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentWillMount() {
        this.props.provider({
            getData: () => { return this.state },
        });
    }
    componentWillUnmount() {
        this.props.provider(null);
    }


    render() {
        return (
            <form className="create-job-form" onSubmit={this.props.onSubmit}>
                <div style={{padding: "30px", fontSize: "20px"}}>AWS Training not implemented yet</div>
            </form>
        );
    }
}

export default AWSJobForm;