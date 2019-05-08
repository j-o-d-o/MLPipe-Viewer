import React from 'react';
import PropTypes from 'prop-types';
import Validation from 'components/validation';
import { TextField } from '@rmwc/textfield';


class AWSRequestForm extends React.Component {
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

        this.defaultData = {
            imageId: "ami-xxx",
            instanceType: "t2.micro",
            keyName: "",
            securityGroupId: "sg-xxx",
            spotPrice: 0.1,
        }

        this.state = {
            ...this.defaultData
        };


        this.awsConfig = {
            InstanceCount: 1,
            LaunchSpecification: {
                ImageId: null,
                InstanceType: null,
                KeyName: null,
                SecurityGroupIds: []
            },
            SpotPrice: null, 
            Type: "one-time",
        }
    }

    componentDidMount() {
        this.props.provider({
            getData: () => {
                this.awsConfig.SpotPrice = this.state.spotPrice.toString();
                this.awsConfig.LaunchSpecification.ImageId = this.state.imageId;
                this.awsConfig.LaunchSpecification.InstanceType = this.state.instanceType;
                this.awsConfig.LaunchSpecification.KeyName = this.state.keyName;
                this.awsConfig.LaunchSpecification.SecurityGroupIds = [this.state.securityGroupId];

                return this.awsConfig;
            },
            reset: () => {
                this.setState({ ...this.defaultData });
            }
        });
    }

    componentWillUnmount() {
        this.props.provider(null);
    }

    render() {
        // TODO: Add info about each field so users can easily find where to put in this stuff
        return (
            <form id={this.props.id} onSubmit={this.props.onSubmit}>
                <Validation data={this.props.validation} />
                <TextField
                    required
                    label="ImageId"
                    value={this.state.imageId}
                    style={{ width: "90%", maxWidth: "500px", marginTop: "40px" }}
                    onChange={e => this.setState({imageId: e.target.value })}
                />
                <TextField
                    required
                    label="Instance Type"
                    value={this.state.instanceType}
                    style={{ width: "90%", maxWidth: "500px", marginTop: "30px" }}
                    onChange={e => this.setState({instanceType: e.target.value })}
                />
                <TextField
                    required
                    label="Security Group Id"
                    value={this.state.securityGroupId}
                    style={{ width: "90%", maxWidth: "500px", marginTop: "30px" }}
                    onChange={e => this.setState({securityGroupId: e.target.value })}
                />
                <TextField
                    required
                    label="AWS Key Name"
                    value={this.state.keyName}
                    style={{ width: "90%", maxWidth: "500px", marginTop: "30px" }}
                    onChange={e => this.setState({keyName: e.target.value })}
                />
                <TextField
                    required
                    label="Max Price"
                    type="number"
                    value={this.state.spotPrice}
                    style={{ width: "90%", maxWidth: "250px", marginTop: "30px" }}
                    onChange={e => this.setState({spotPrice: e.target.value })}
                />
            </form>
        );
    }
}

export default AWSRequestForm;