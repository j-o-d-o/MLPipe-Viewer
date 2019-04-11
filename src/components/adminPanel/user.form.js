import React from 'react';
import PropTypes from 'prop-types';
import Validation from 'components/validation';
import { TextField } from '@rmwc/textfield';
import { Select } from '@rmwc/select';


class UserForm extends React.Component {
    static propTypes = {
        onSubmit: PropTypes.func,
        provider: PropTypes.func,
        validation: PropTypes.object,
        id: PropTypes.string,
        initalValues: PropTypes.object,
        edit: PropTypes.bool,
    }
    static defaultProps = {
        onSubmit: (evt) => evt.preventDefault(),
        provider: () => {},
        validation: null,
        initalValues: {},
        edit: false,
    }

    constructor(props) {
        super(props);

        const iv = props.initalValues;

        this.state = {
            name: iv["name"] !== undefined ? iv["name"] : "",
            email: iv["email"] !== undefined ? iv["email"] : "",
            role: iv["role"] !== undefined ? toString(iv["role"]) : '0',
            password: "",
        };
    }

    componentWillMount() {
        this.props.provider({
            getData: () => { 
                let userData = this.state;
                userData["role"] = parseInt(userData["role"], 10)
                return userData;
            },
            reset: () => {
                this.setState({ 
                    name: "", email: "", role: '0', password: "",
                });
            }
        });
    }

    componentWillUnmount() {
        this.props.provider(null);
    }

    render() {
        return (
            <form id={this.props.id} autocomplete="off" onSubmit={this.props.onSubmit}>
                <Validation data={this.props.validation} />
                <TextField
                    required
                    autocomplete="false"
                    label="Name"
                    value={this.state.name}
                    style={{ width: "90%", maxWidth: "300px", marginTop: "40px" }}
                    onChange={e => this.setState({name: e.target.value })}
                />
                <TextField
                    required
                    autocomplete="false"
                    label="Email"
                    value={this.state.email}
                    style={{ width: "90%", maxWidth: "300px", marginTop: "30px" }}
                    onChange={e => this.setState({email: e.target.value })}
                />
                {!this.props.edit &&
                <TextField
                    required
                    autocomplete="false"
                    label="Password"
                    value={this.state.password}
                    style={{ width: "90%", maxWidth: "300px", marginTop: "30px" }} 
                    onChange={e => this.setState({password: e.target.value })}
                />
                }
                <Select
                    rootProps={{
                        style: { maxWidth: "300px", display: "block", marginTop: "30px", marginBottom: "20px" }
                    }}
                    value={this.state.role}
                    defaultValue={this.state.role}
                    onChange={evt => this.setState({role: evt.target.value})}
                    label="User Role"
                    options={[
                        { label: 'User', value: '0' },
                        { label: 'Admin', value: '100' },
                    ]}
                />
            </form>
        );
    }
}

export default UserForm;