import React from 'react';
import PropTypes from 'prop-types';
import { Chart } from "frappe-charts/dist/frappe-charts.esm.js";


class PlotMetric extends React.Component {
    static propTypes = {
        validationData: PropTypes.array.isRequired,
        trainingData: PropTypes.array.isRequired,
        name: PropTypes.string.isRequired,
        height: PropTypes.number,
    }
    static defaultProps = {
        height: 600,
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

    componentWillReceiveProps(nextProps) {
        if (this.props.name !== nextProps.name ||
            this.props.height !== nextProps.height) {
            this.props = nextProps;
            this.createChart();
        }
        else {
            console.log("ONLY UPDATE!");
            const data = this.createData();
            this._chart.update(data);
        }
    }

    createData = () => {
        return {
            labels: ["12am-3am", "3am-6pm", "6am-9am", "9am-12am",
                "12pm-3pm", "3pm-6pm", "6pm-9pm", "9am-12am"
            ],
            datasets: [
                {
                    name: "Some Data", type: "bar",
                    values: [25, 40, 30, 35, 8, 52, 17, -4]
                },
                {
                    name: "Another Set", type: "line",
                    values: [25, 50, -10, 15, 18, 32, 27, 14]
                }
            ]
        };
    }

    createChart = () => {
        const data = this.createData();

        this._chart = new Chart(this._chartRef.current, {
            title: this.props.name,
            data: data,
            type: 'line',
            height: this.props.height,
            colors: ['#7cd6fd', '#743ee2']
        })
    }

    render() {
        return (
            <div className="metric-plot">
                <div ref={this._chartRef} />
            </div>
        );
    }
}

export default PlotMetric;