var React = require("react");
var Chart;
var randomColor = require('randomcolor');

var ChartApp = React.createClass({
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
        var options = {
          responsive: false
        };
        var data = {
          labels: result.labels,
          datasets: [
            {
              data: result.data,
              backgroundColor: randomColor({
                count: result.data.length
              })
              // backgroundColor: [
              //   "#FF6384",
              //   "#36A2EB",
              //   "#FFCE56"
              // ],
              // hoverBackgroundColor: [
              //   "#FF6384",
              //   "#36A2EB",
              //   "#FFCE56"
              // ]
            }]
        };
        var myDoughnutChart = new Chart(ctx, {
          type: 'doughnut',
          data: data,
          options: options
        });
      }
    });
  },
  render() {
    return (<div className="container chart-container">
    <canvas id="myChart" width="500" height="500" style={{width: '500px', height: '500px'}}></canvas>
  </div>);
}
});

module.exports = ChartApp;
