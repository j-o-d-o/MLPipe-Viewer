import React from 'react';
import PropTypes from 'prop-types';
import Validation from 'components/validation';
import { TextField } from '@rmwc/textfield';


class UserForm extends React.Component {
    static propTypes = {
        onSubmit: PropTypes.func,
        provider: PropTypes.func,
        validation: PropTypes.object,
        id: PropTypes.string,
        initalValues: PropTypes.object,
    }
    static defaultProps = {
        onSubmit: (evt) => evt.preventDefault(),
        provider: () => {},
        validation: null,
        initalValues: {},
    }

    constructor(props) {
        super(props);

        const iv = props.initalValues;
        console.log(iv);

        this.state = {
            name: iv["name"] !== undefined ? iv["name"] : "",
            email: iv["email"] !== undefined ? iv["email"] : "",
            role: iv["role"] !== undefined ? iv["role"] : "",
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
        console.log(this.state);
        return (
            <form id={this.props.id} onSubmit={this.props.onSubmit}>
                <Validation data={this.props.validation} />
                <TextField required label="Name" value={this.state.name} style={{ width: "300px", marginTop: "10px" }} onChange={e => this.setState({name: e.target.value })}/>
                <TextField required label="Email" value={this.state.email} style={{ width: "300px", marginTop: "10px" }} onChange={e => this.setState({email: e.target.value })}/>
            </form>
        );
    }
}

export default UserForm;