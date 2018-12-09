import React from 'react';
import PropTypes from 'prop-types';


class Validation extends React.Component {
    static defaultProps = {
        data: PropTypes.shape({
            status: PropTypes.number,
            json: PropTypes.object
        }).isRequired,
    }
    constructor(props) { 
        super(props);
        this.state = {};
    }

    render() {
        if( this.props.data !== null &&
            this.props.data !== undefined && 
            this.props.data !== "" &&
            this.props.data.status !== undefined &&
            this.props.data.json !== undefined &&
            this.props.data.status === 400){

            const valText = this.props.data.json.data;
            return (
                <div className="validation_component">
                    {valText.map(function(name, index) {
                        return <div key={index} className="validation_text">{name.msg}</div>;
                    })}
                </div>
            );
        }
        else{
            return(
                <div></div>
            );
        }

    }
}

export default Validation