import ColorMapper from 'state/color-mapper';

const ChartUtil = {
  CHART_OPTIONS: {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'x'
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
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'month',
          fontColor: '#6699ff'
        }
      }]
    },
    animation: {
      duration: 2000
    }
  },

  addStyleToDatasets(datasets) {
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
  }
};

export default ChartUtil;