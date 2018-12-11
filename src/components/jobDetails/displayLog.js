// TODO: scroll to top of log on maximize()
//       adjust height on maximize to viewport (or a bit smaller)
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@rmwc/button';


class DisplayLog extends React.Component {
    static propTypes = {
        log: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        className: PropTypes.string,
    }
    static defaultProps = {
        className: "",
    }

    constructor(props) {
        super(props);
        this.state = {
            showFull: false,
            style: {
                height: "76px",
                overflow: "hidden",
            }
        };
    }

    toggleLog = () => {
        if(this.state.showFull) {
            // Minimize Log and set showFull to false
            this.minimize();
            this.setState({ showFull: false });
        }
        else {
            this.maximize();
            this.setState({ showFull: true });
        }
    }

    minimize = () => {
        this.setState({ style: {
            height: "76px",
            overflow: "hidden",
        }});
    }

    maximize = () => {
        this.setState({ style: {
            height: "400px",
            overflow: "auto",
        }});
    }

    render() {
        const className = "display-log-wrapper " + this.props.className;
        return (
            <div className={className}>
                <h4>{this.props.name}</h4>
                <div className="log" style={this.state.style}> {this.props.log}</div>
                <Button className="toggle-log-btn" onClick={this.toggleLog}>{this.state.showFull ? "minimize log" : "show full log"}</Button>
            </div>
        );
    }
}

export default DisplayLog;