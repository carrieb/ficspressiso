var React = require("react");
var Chart;
var randomColor = require('randomcolor');

var ChartApp = React.createClass({
  getInitialState() {
    return ({
      data: null,
      chart: null,
      loaded: false,
      options: {
        responsive: false,
        legend: {
          display: false
        },
        tooltips: {
          bodyFontSize: 18
        },
        onClick: this.onChartClick
      }
    });
  },
  initializeData(result) {
    return {
      labels: result.labels,
      datasets: [
        {
          data: result.data,
          backgroundColor: randomColor({
            count: result.data.length,
            hue: 'blue'
          })
        }
      ]
    };
  },
  initializeChart(ctx, data) {
    console.log(ctx, data, this.state.options, this.onChartClick);
    return new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: this.state.options
    });
  },
  onChartClick(ev, chart) {
    console.log(ev, chart);
    var activePoints = this.state.chart.getElementsAtEvent(ev);
    console.log('active', activePoints);
    for (var i = 0; i < activePoints.length; i++) {
      var point = activePoints[i];
      console.log(point);
      console.log(point["_model"]["label"]);
      // TODO: we don't want to update the chart data - we want to show a list of those Stories
      // somewhere?
    }
  },
  updateChartData(char) {
    return $.ajax('/ajax/chart_data', {
      data: {
        page: 1,
        character: char
      }
    })
  },
  componentDidMount() {
    //var myChart = new Chart({});
    var renderChart = this.props.renderChart;
    if (renderChart) {
      this.updateChartData('').done((result) => {
        if (!this.state.loaded) {
          Chart = require('chart.js');
        }
        var ctx = document.getElementById("myChart");
        console.log(result.data.length);
        var data = this.initializeData(result);
        var chart = this.initializeChart(ctx, data);
        this.setState({
          data: data,
          loaded: true,
          chart: chart
        });
      });
    }
  },
  render() {
    var loadingBar = null;
    var chartCanvas =  (<canvas id="myChart" width="500" height="500" style={{width: '500px', height: '500px', display: 'inline'}}></canvas>);;
    if (!this.state.loaded) {
      loadingBar = (
        <div className="ui segment" style={{ border: 'none', boxShadow: 'none'}}>
          <div className="ui active inverted dimmer">
            <div className="ui medium text loader">Loading</div>
          </div>
          <p>hihihihi</p>
          <p>hihihihi</p>
          <p>hihihihi</p>
        </div>
      );
    }
    return (<div className="container chart-container">
      { loadingBar }
      { chartCanvas }
    </div>);
  }
});

module.exports = ChartApp;
