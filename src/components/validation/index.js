import React from 'react';

class Validation extends React.Component {
    constructor(props) { 
        super(props);
        this.state = {};
    }

    static defaultProps = {

    }

    render() {
        if( this.props.data !== undefined && 
            this.props.data !== "" &&
            this.props.data.status !== undefined &&
            this.props.data.json !== undefined &&
            this.props.data.status === 400){

            var valText = this.props.data.json.data;
            return (
                <div className="validation_component">
                    {valText.map(function(name, index) {
                        return <div key={index} className="validation_text">{name.msg.text}</div>;
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