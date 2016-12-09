var chart_data = null;

// TODO: do this while we are getting the fics? (for each char);
var fillChartData = function() {
  chart_data = {
    labels: [],
    data: [],
  }

  for (var i in browse_data) {
    for (var j in browse_data[i].chars) {
      var idx = chart_data.labels.indexOf(browse_data[i].chars[j]);
      if (idx > -1) {
        chart_data.data[idx] = chart_data.data[idx] + 1;
      } else {
        chart_data.labels.push(browse_data[i].chars[j]);
        chart_data.data.push(1);
      }
    }
  }
}
