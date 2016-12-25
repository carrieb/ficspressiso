import React from 'react';

import { Chart } from 'chart.js';

import ApiUtils from '../../api/util.js'

import ColorMapper from '../../state/ColorMapper.js';

const NewChart = React.createClass({
  componentWillMount() {
    this.updateChart();
  },

  componentDidMount() {
    this.initializeChart();
  },

  getInitialState() {
    return {
      chart: null,
      data: {}
    }
  },

  getChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000
      },
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'number of new fics',
            fontColor: '#6699ff'
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'month of 2016'
          }
        }]
      },
      animation: {
        duration: 2000
      }
    };
  },

  componentDidUpdate() {
    if (this.state.chart) {
      this.state.chart.update();
    }
  },

  initializeChart() {
    const chart = new Chart(this.context, {
      type: 'line',
      data: this.state.data,
      options: this.getChartOptions()
    });
    this.setState({ chart });
  },

  redrawChart(datasets, labels) {
    this.state.data.labels = labels;
    this.state.data.datasets = datasets;
    console.log(this.state.data);
    this.setState({ data: this.state.data });
  },

  updateChart() {
    ApiUtils.getChartData()
    .done(({ datasets, labels }) => {
      datasets.forEach((dataset, idx) => {
        const color = ColorMapper.getColorForCharacter(dataset.label);
        const colorArr = ColorMapper.getRgbArrayForCharacter(dataset.label);

        dataset.fill = false;
        dataset.borderJoinStyle = 'miter';
        dataset.lineTension = 0.1;
        dataset.backgroundColor = "rgba(" + colorArr.join(',') + ",0.4)";
        dataset.borderColor = "rgba(" + colorArr.join(',') + ",1)";
      });

      console.log(datasets, labels);

      if (this.state.chart) {
        this.redrawChart(datasets, labels);
      } else {
        this.initializeChart(datasets, labels);
      }
    });
  },

  render() {
    return (
      <div className="chart-container">
        <canvas ref={(canvas) => { this.context = canvas }} width="400" height="400"></canvas>
        <div className="center aligned">
          <button className="ui button purple" onClick={this.updateChart}>reload</button>
        </div>
      </div>
    );
  }
});

export default NewChart;
