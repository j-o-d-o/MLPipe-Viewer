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
        edit: PropTypes.bool,
    }
    static defaultProps = {
        onSubmit: (evt) => evt.preventDefault(),
        provider: () => {},
        validation: null,
        edit: false,
    }

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            email: "",
            role: '0',
            password: "",
        };
    }

    componentDidMount() {
        this.props.provider({
            getData: () => { 
                let userData = this.state;
                userData["role"] = parseInt(userData["role"], 10);
                if(this.props.edit) {
                    delete userData["password"];
                }
                return userData;
            },
            setData: (user) => {
                this.setState({
                    name: user.name,
                    email: user.email,
                    role: user.role.toString(10),
                })
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
            <form id={this.props.id} autoComplete="off" onSubmit={this.props.onSubmit}>
                <Validation data={this.props.validation} />
                <TextField
                    required
                    autoComplete="false"
                    label="Name"
                    value={this.state.name}
                    style={{ width: "90%", maxWidth: "300px", marginTop: "40px" }}
                    onChange={e => this.setState({name: e.target.value })}
                />
                <TextField
                    required
                    autoComplete="false"
                    label="Email"
                    value={this.state.email}
                    style={{ width: "90%", maxWidth: "300px", marginTop: "30px" }}
                    onChange={e => this.setState({email: e.target.value })}
                />
                {!this.props.edit &&
                <TextField
                    required
                    autoComplete="false"
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