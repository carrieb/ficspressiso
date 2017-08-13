import React from 'react';

import { Chart } from 'chart.js';

import ApiUtils from '../../api/util.js'

import ColorMapper from '../../state/ColorMapper.js';

import ApiMultipleCharacterDropdown from 'components/forms/ApiMultipleCharacterDropdown';
import FicQueryForm from 'components/common/fic-query-form.react';

const ApiFicsPerCharacterChart = React.createClass({
  getInitialState() {
    return {
      query: {
          characters: ['Hermione G.', 'Harry P.', 'Ginny W.', 'Ron W.'],
          start: '2001-01-01',
          end: '2017-12-31',
          rating: [],
          minWords: 0,
          maxWords: 100000000
      },
      data: {},
      loaded: false
    }
  },

  componentWillMount() {
    this.updateData();
  },

  updateData() {
    this.setState({
      loaded: false
    });
    ApiUtils.getChartData(this.state.query)
    .done(({ datasets, labels }) => {
      datasets.forEach((dataset, idx) => {
        const color = ColorMapper.getColorForCharacter(dataset.label);
        const colorArr = ColorMapper.getRgbArrayForCharacter(dataset.label);

        dataset.fill = false;
        dataset.borderJoinStyle = 'miter';
        dataset.lineTension = 0.25;
        dataset.backgroundColor = "rgba(" + colorArr.join(',') + ",1)";
        dataset.borderColor = "rgba(" + colorArr.join(',') + ",0.4)";
        dataset.pointRadius = 0.5;
      });

      console.log(datasets, labels);
      const data = this.state.data;
      data.datasets = datasets;
      data.labels = labels;
      this.setState({ data, loaded: true });
    });
  },

  render() {
    console.log(this.state.characters, this.state.end, this.state.loaded);
    return (
      <div className="chart-page">
        <div className="ui basic segment api-fics-per-character-chart-container">
          { !this.state.loaded && <div className="ui active large text loader">Loading..</div> }
          <NewChart data={this.state.data}/>
        </div>
        <div>
          <FicQueryForm query={this.state.query}
                        updateQuery={(query) => this.setState({ query })}/>
          <div className="center aligned">
            <button className="ui button purple" onClick={this.updateData}>reload</button>
          </div>
        </div>
      </div>
    )
  }
});

const NewChart = React.createClass({
  propTypes: {
      data: React.PropTypes.object.isRequired
  },

  componentDidMount() {
    this.initializeChart();
  },

  componentDidUpdate() {
    if (this.state.chart) {
      this.state.chart.update();
    }
  },

  getInitialState() {
    return {
      chart: null
    }
  },

  getChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000
      },
      legend: {
        position: 'right'
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
            labelString: 'month'
          }
        }]
      },
      animation: {
        duration: 2000
      }
    };
  },

  initializeChart() {
    const chart = new Chart(this.context, {
      type: 'line',
      data: this.props.data,
      options: this.getChartOptions()
    });
    this.setState({ chart });
  },

  render() {
    return (
      <div className="chart-container">
        <canvas ref={(canvas) => { this.context = canvas }} width="400" height="400"></canvas>
      </div>
    );
  }
});

export default ApiFicsPerCharacterChart;
