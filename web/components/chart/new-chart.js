import React from 'react';

import { Chart } from 'chart.js';

import ApiUtils from '../../api/util.js'

import ColorMapper from '../../state/ColorMapper.js';

const ApiMultipleCharacterDropdown = React.createClass({
  propTypes: {
    characters: React.PropTypes.array.isRequired,
    updateCharacters: React.PropTypes.func.isRequired
  },

  componentDidMount() {
    $(this.dropdown).dropdown({
      onChange: this.onChange
    });
  },

  onChange(valueString) {
    this.props.updateCharacters(valueString.split(','));
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.state.loaded && !prevState.loaded) {
      $(this.dropdown).dropdown({
        onChange: this.onChange
      });
    }
  },

  getInitialState() {
    return {
      loaded: false,
      characterOptions: []
    };
  },

  componentWillMount() {
    this.loadCharacterOptions();
  },

  loadCharacterOptions() {
    this.setState({ loaded: false });
    ApiUtils.getCharacters()
    .done((characterOptions) => {
      this.setState({
        loaded: true,
        characterOptions
      })
    });
  },

  render() {
    const options = this.state.characterOptions.map((character, idx) => {
      return (
        <div className="item" key={idx} data-value={character} data-text={character}>
          {character}
        </div>
      );
    });
    return (
      <div className={`ui ${this.state.loaded ? '' : 'loading '}fluid multiple search selection dropdown`} ref={(dropdown) => { this.dropdown = dropdown; }}>
        <input type="hidden" name="characters" value={this.props.characters.join(',')}/>
        <i className="dropdown icon"></i>
        <div className="default text">Characters...</div>
        <div className="menu">
          { options }
        </div>
      </div>
    );
  }
});

const ApiFicsPerCharacterChart = React.createClass({
  getInitialState() {
    return {
      characters: ['Hermione G.', 'Harry P.', 'Ginny W.', 'Ron W.'],
      start: '2016-01-01',
      end: '2016-12-31',
      data: {}
    }
  },

  componentWillMount() {
    this.updateData();
  },

  updateData() {
    const characters = this.state.characters;
    const start = this.state.start;
    const end = this.state.end;
    ApiUtils.getChartData({
      characters, start, end
    })
    .done(({ datasets, labels }) => {
      datasets.forEach((dataset, idx) => {
        const color = ColorMapper.getColorForCharacter(dataset.label);
        const colorArr = ColorMapper.getRgbArrayForCharacter(dataset.label);

        dataset.fill = false;
        dataset.borderJoinStyle = 'miter';
        dataset.lineTension = 0.25;
        dataset.backgroundColor = "rgba(" + colorArr.join(',') + ",0.4)";
        dataset.borderColor = "rgba(" + colorArr.join(',') + ",1)";
      });

      console.log(datasets, labels);
      const data = this.state.data;
      data.datasets = datasets;
      data.labels = labels;
      this.setState({ data });
    });
  },

  render() {
    console.log(this.state.characters, this.state.end);
    return (
      <div className="chart-page">
        <div className="api-fics-per-character-chart-container">
          <NewChart data={this.state.data}/>
          <form className="ui form">
            <div className="field">
                <label>Characters</label>
                <ApiMultipleCharacterDropdown updateCharacters={(characters) => { this.setState({ characters }); }}
                                              characters={this.state.characters} />
            </div>
            <div className="field">
              <div className="two fields">
                <div className="field">
                  <label>Start</label>
                  <input type="text" name="start" value={this.state.start} onChange={(ev) => { const start = ev.target.value; this.setState({ start }); }}/>
                </div>
                <div className="field">
                  <label>End</label>
                  <input type="text" name="end" value={this.state.end} onChange={(ev) => { const end = ev.target.value; this.setState({ end }); }}/>
                </div>
              </div>
            </div>
          </form>
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
            labelString: 'month of 2016'
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
