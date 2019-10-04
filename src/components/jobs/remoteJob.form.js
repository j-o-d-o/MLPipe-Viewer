import React from 'react';
import PropTypes from 'prop-types';
import KeystoreApi from 'apis/keystore';
import Validation from 'components/validation';
import { TextField } from '@rmwc/textfield';
import { LinearProgress } from '@rmwc/linear-progress';
import { Select } from '@rmwc/select';
import { getUser } from 'utils/auth.util.js';


class RemoteJobForm extends React.Component {
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

        this._mountGuard = true;

        this.state = {
            showLoading: true,
            keyOptions: [],

            name: "",
            description: "",
            exec_path: "",
            config_path: "",
            conda_env: "",
            api_url: "https://",
            server_ip: "",
            ssh_port: 22,
            user_name: "",
            key: "",
            aws_spot_request_id: "",
            aws_instance_id: "",
            train_src: null,
        };
    }

    async componentDidMount() {
        this.props.provider({
            getData: () => {
                let formData = new FormData();
                formData.append("name", this.state.name);
                formData.append("description", this.state.description);
                formData.append("exec_path", this.state.exec_path);
                formData.append("conda_env", this.state.conda_env);
                formData.append("api_url", this.state.api_url);
                formData.append("config_path", this.state.config_path);
                formData.append("server_ip", this.state.server_ip);
                formData.append("ssh_port", this.state.ssh_port);
                formData.append("user_name", this.state.user_name);
                formData.append("key", this.state.key);
                formData.append("aws_spot_request_id", this.state.aws_spot_request_id);
                formData.append("aws_instance_id", this.state.aws_instance_id);
                if(this.state.train_src !== null) {
                    formData.append('train_src', this.state.train_src, this.state.train_src.name);
                }
                return formData;
            },
            getDataAsObject: () => {
                const objData = {
                    "name": this.state.name,
                    "description": this.state.description,
                    "exec_path": this.state.exec_path,
                    "conda_env": this.state.conda_env,
                    "api_url": this.state.api_url,
                    "config_path": this.state.config_path,
                    "server_ip": this.state.server_ip,
                    "ssh_port": this.state.ssh_port,
                    "user_name": this.state.user_name,
                    "key": this.state.key,
                    "aws_spot_request_id": this.state.aws_spot_request_id,
                    "aws_instance_id": this.state.aws_instance_id,
                };
                return objData;
            },
            setData: (defaultParams) => {
                this.setState({
                    name: defaultParams.name || "",
                    description: defaultParams.description || "",
                    exec_path: defaultParams.exec_path || "",
                    config_path: defaultParams.config_path || "",
                    conda_env: defaultParams.conda_env || "",
                    api_url: defaultParams.api_url || "https://",
                    server_ip: defaultParams.server_ip || "",
                    ssh_port: defaultParams.ssh_port || 22,
                    user_name: defaultParams.user_name || "",
                    key: defaultParams.key || "",
                    aws_instance_id: defaultParams.aws_instance_id || "",
                    aws_spot_request_id: defaultParams.aws_spot_request_id || "",
                })
            },
        });

        const user = getUser();
        this._mountGuard = false;
        this.setState({showLoading: true});
        const res = await KeystoreApi.get(user._id);
        if (this._mountGuard) return;
        this.setState({showLoading: false});
        if (res.status === 200) {
            // Create select list
            const keyOptions = [];
            res.json.forEach(key => {
                keyOptions.push({
                    label: key.name,
                    value: key._id,
                })
            });
            this.setState({keyOptions: keyOptions});
        } 
        else {
            console.log(res);
        }
    }

    componentWillUnmount() {
        this.props.provider(null);
    }

    render() {
        return (
            <form id={this.props.id} onSubmit={this.props.onSubmit}>
                <LinearProgress style={{position: "absolute", zIndex: 1}} closed={!this.state.showLoading}/>
                <Validation data={this.props.validation} />
                <TextField
                    required
                    label="Name"
                    style={{ width: "100%", marginTop: "10px" }}
                    value={this.state.name}
                    onChange={e => this.setState({name: e.target.value })}/>
                <textarea 
                    className="default-textarea"
                    placeholder="Description"
                    value={this.state.description} 
                    onChange={e => this.setState({ description: e.target.value })}/>

                <div className="sub-heading">Project Details</div>
                <label>
                    <span style={{fontSize: "14px"}}>Chose your training project (as .zip)</span><br/>
                    <input 
                        name="train_src"
                        type="file"
                        size="50"
                        accept=".zip"
                        onChange={e => this.setState({train_src: e.target.files[0] })}/>
                </label>

                <TextField
                    required
                    label="Execution Path"
                    helpText={{ children: "Path to the main python file e.g. cifar10/train.py", persistent: true }}
                    style={{ width: "100%", marginTop: "10px" }}
                    value={this.state.exec_path}
                    onChange={e => this.setState({exec_path: e.target.value })}/>
                <TextField
                    required
                    label="Config Path"
                    helpText={{ children: "Path to the config file e.g. cifar10/config.ini", persistent: true }}
                    style={{ width: "100%", marginTop: "10px" }}
                    value={this.state.config_path}
                    onChange={e => this.setState({config_path: e.target.value })}/>
                <TextField
                    required
                    label="Conda Environment"
                    style={{ width: "48%", marginTop: "10px" }}
                    value={this.state.conda_env}
                    onChange={e => this.setState({conda_env: e.target.value })}/>
                <TextField
                    required
                    label="API Url"
                    style={{ width: "48%", marginLeft: "4%", marginTop: "10px" }}
                    value={this.state.api_url}
                    onChange={e => this.setState({api_url: e.target.value })}/>
                
                <div className="sub-heading">Training Server</div>
                <TextField
                    required
                    label="Remote Server IP"
                    style={{ width: "80%", marginTop: "10px" }}
                    value={this.state.server_ip}
                    onChange={e => this.setState({server_ip: e.target.value })}/>
                <TextField
                    required
                    label="SSH Port"
                    style={{ width: "17%", marginLeft: "3%", marginTop: "10px" }}
                    type="number"
                    value={this.state.ssh_port}
                    onChange={e => this.setState({ssh_port: e.target.value })}/>
                <TextField
                    required
                    label="User Name"
                    style={{ width: "100%", marginTop: "10px" }}
                    value={this.state.user_name}
                    onChange={e => this.setState({user_name: e.target.value })}/>
                <Select
                    required
                    label="Key"
                    rootProps={{style:{ width: "50%", marginTop: "10px" }}}
                    onChange={e => this.setState({key: e.target.value})}
                    value={this.state.key}
                    options={this.state.keyOptions}/>

                <div className="sub-heading">AWS Specifics</div>
                <TextField
                    label="AWS Spot Request Id"
                    helpText={{ children: "Cancel Spot Request after training is finished (does not automatically cancel Instances)", persistent: true }}
                    style={{ width: "100%", marginTop: "10px" }}
                    value={this.state.aws_spot_request_id}
                    onChange={e => this.setState({aws_spot_request_id: e.target.value })}/>
                <TextField
                    label="AWS Instance Id"
                    helpText={{ children: "Terminate Instance after training has finished", persistent: true }}
                    style={{ width: "100%", marginTop: "10px" }}
                    value={this.state.aws_instance_id}
                    onChange={e => this.setState({aws_instance_id: e.target.value })}/>
            </form>
        );
    }
}

export default RemoteJobForm;