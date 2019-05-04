import React from 'react';
import PropTypes from 'prop-types';
import Validation from 'components/validation';
import { TextField } from '@rmwc/textfield';


class LocalJobForm extends React.Component {
    static propTypes = {
        onSubmit: PropTypes.func,
        provider: PropTypes.func,
        validation: PropTypes.object,
        id: PropTypes.string,
    }
    static defaultProps = {
        onSubmit: (evt) => evt.preventDefault(),
        provider: () => {},
        validation: null,
    }

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            description: "",
        };
    }

    componentDidMount() {
        this.props.provider({
            getData: () => { return this.state },
        });
    }
    componentWillUnmount() {
        this.props.provider(null);
    }


    render() {
        return (
            <form id={this.props.id} onSubmit={this.props.onSubmit}>
                <Validation data={this.props.validation} />
                <TextField required label="Name" style={{ width: "100%", marginTop: "10px" }} onChange={e => this.setState({name: e.target.value })}/>
                <textarea className="default-textarea" placeholder="Description" onChange={e => this.setState({ description: e.target.value })}/>
            </form>
        );
    }
}

export default LocalJobForm;