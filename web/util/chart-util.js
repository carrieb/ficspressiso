import ColorMapper from 'state/color-mapper';

const ChartUtil = {
  CHART_OPTIONS: {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'x',
      intersect: false,
      itemSort: function(a, b) {
        return parseInt(b.yLabel) - parseInt(a.yLabel);
      },
      backgroundColor: 'rgba(0,0,0,.2)'
    },
    animation: {
      duration: 1000
    },
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'number of new fics',
          fontColor: '#6699ff'
        },
        gridLines: {
          color: ['rgba(0,0,0,.1)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0)','rgba(0,0,0,0.1)', 'rgba(0,0,0,0)','rgba(0,0,0,0.1)', 'rgba(0,0,0,0)']
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'month',
          fontColor: '#6699ff'
        },
        gridLines: {
          drawOnChartArea: false
        }
      }]
    }
  },

  addStyleToDatasets(datasets) {
    datasets.forEach((dataset, idx) => {
      const color = ColorMapper.getColorForCharacter(dataset.label);
      const colorArr = ColorMapper.getRgbArrayForCharacter(dataset.label);

      let pointHitRadius = 0.5;
      if (dataset.data.length < 20) {
        pointHitRadius = 20;
      } else if (dataset.data.length < 50) {
        pointHitRadius = 5;
      } else if (dataset.data.length < 100) {
        pointHitRadius = 2;
      }
      console.log(dataset.data.length, pointHitRadius);

      dataset.fill = false;
      dataset.borderJoinStyle = 'miter';
      dataset.lineTension = 0.25;
      dataset.backgroundColor = "rgba(" + colorArr.join(',') + ",1)";
      dataset.borderColor = "rgba(" + colorArr.join(',') + ",0.4)";
      dataset.pointRadius = 1;
      dataset.pointHitRadius = pointHitRadius;
    });
  }
};

export default ChartUtil;