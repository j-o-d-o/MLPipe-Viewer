import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';


class PlotMetric extends React.Component {
    static propTypes = {
        validationData: PropTypes.array,
        trainingData: PropTypes.array,
        name: PropTypes.string.isRequired,
        expId: PropTypes.string.isRequired,
    }
    static defaultProps = {
        trainingData: [],
        validationData: [],
    }

    constructor(props) {
        super(props);
        this._chart = null;
        this._chartRef = React.createRef();

        this.state = {};
    }

    componentDidMount() {
        this.createChart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.name !== prevProps.name ||
            this.props.expId !== prevProps.expId ||
            this.props.validationData.length !== prevProps.validationData.length ||
            this.props.trainingData.length !== prevProps.trainingData.length) {
            const data = this.createData();
            this._chart.data = data;
            this._chart.update();
        }
    }

    createData = () => {
        let labels = [];
        let trainValues = [];
        let valValues = [];
        const td = this.props.trainingData || [];
        const vd = this.props.validationData || [];
        let valCounter = 0;
        for(let i = 0; i < td.length; ++i) {
            const label = td[i].epoch + " | " + td[i].batch;
            labels.push(label);
            trainValues.push(td[i].value);
            if(vd[valCounter] !== undefined &&
               vd[valCounter].epoch === td[i].epoch && 
               vd[valCounter].batch === td[i].batch) {
                valValues.push(vd[valCounter].value);
                valCounter++;
            }
            else {
                valValues.push(null);
            }
        }
        return {
            labels: labels,
            datasets: [
                {
                    label: "training-" + this.props.name,
                    data: trainValues,
                    fill: false,
                    borderColor: '#1a237e',
                    pointRadius: 0,
                },
                {
                    label: "validation-" + this.props.name,
                    data: valValues,
                    fill: false,
                    spanGaps: true,
                    borderColor: '#43a047',
                },
            ],
        };
    }

    createChart = () => {
        const data = this.createData();
        this._chart = new Chart(this._chartRef.current, {
            data: data,
            type: 'line',
            options: {
                title: {
                  display: true,
                  text: 'Metric Plot',
                },
                animation: {
                    duration: 0,
                },
                hover: {
                    animationDuration: 0,
                },
                responsiveAnimationDuration: 0,
              }
        })
    }

    render() {
        return (
            <div className="metric-plot">
                <canvas ref={this._chartRef} style={{ width: "100%", height: "550px" }}></canvas>
            </div>
        );
    }
}

export default PlotMetric;