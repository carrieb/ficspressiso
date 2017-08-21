import React from 'react';
import PropTypes from 'prop-types';

import { Chart as ChartJs } from 'chart.js';

import ChartUtil from 'utils/chart-util';

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chart: null
    };
  }
  
  componentDidMount() {
    const chart = new ChartJs(this.context, {
      type: 'line',
      data: this.props.data,
      options: ChartUtil.CHART_OPTIONS
    });
    this.setState({ chart });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.chart) {
      const chart = this.state.chart;
      chart.data.labels = nextProps.data.labels;
      chart.data.datasets = nextProps.data.datasets;
      chart.update();
    }
  }

  render() {
    return (
      <div className="chart-container">
        <canvas ref={(canvas) => { this.context = canvas }}
                width="400" height="400"/>
      </div>
    );
  }
};

Chart.propTypes = {
  data: PropTypes.object.isRequired
};

export default Chart;