import React from 'react';
import PropTypes from 'prop-types';
import Validation from 'components/validation';

import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/github';


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

        const defaultDataObj = {
            InstanceCount: 1,
            LaunchSpecification: {
                ImageId: "ami-xxx",
                InstanceType: "t2.micro",
                KeyName: "",
                SecurityGroupIds: ["sg-xxx"]
            },
            SpotPrice: 0.1, 
            Type: "one-time",
        };
        this.defaultData = JSON.stringify(defaultDataObj, null, 4);

        this.state = {
            awsConfig: this.defaultData,
        };
    }

    componentDidMount() {
        this.props.provider({
            getData: () => {
                try {
                    return JSON.parse(this.state.awsConfig);
                } catch (e) {
                    return false;
                }
            },
            reset: () => {
                this.setState({ awsConfig: this.defaultData });
            }
        });
    }

    componentWillUnmount() {
        this.props.provider(null);
    }

    render() {
        // TODO: Add info about each field
        return (
            <form id={this.props.id} onSubmit={this.props.onSubmit}>
                <Validation data={this.props.validation} />

                <AceEditor
                    style={{marginTop: "15px", height: "400px", border: "1px solid #c1c1c1"}}
                    mode="json"
                    theme="github"
                    name="aws_config_input"
                    onChange={(config) => this.setState({ awsConfig: config })}
                    value={this.state.awsConfig}
                    editorProps={{$blockScrolling: true}}
                />
            </form>
        );
    }
}

export default AWSRequestForm;