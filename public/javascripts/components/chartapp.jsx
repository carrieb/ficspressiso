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
        }
      }
    });
  },
  initializeChart(ctx, data) {
    console.log(ctx, data, this.state.options);
    var myDoughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: this.state.options
    });
  },
  componentDidMount() {
    //var myChart = new Chart({});
    var renderChart = this.props.renderChart;
    $.ajax('/ajax/chart_data', {
      data: {
          page: 1
      }
    }).done(function(result) {
      if (renderChart) {
        Chart = require('chart.js');
        var ctx = document.getElementById("myChart");
        console.log(result.data.length)
        var data = {
          labels: result.labels,
          datasets: [
            {
              data: result.data,
              backgroundColor: randomColor({
                count: result.data.length
              })
            }]
        };
        this.initializeChart(ctx, data);
        this.setState({
          data: data,
          loaded: true
        })
      }
    }.bind(this));
  },
  render() {
    var loadingBar = null;
    var chartCanvas =  (<canvas id="myChart" width="500" height="500" style={{width: '500px', height: '500px'}}></canvas>);;
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
