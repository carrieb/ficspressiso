import React from 'react';
import PropTypes from 'prop-types';

import TimelineHeatmap from './timeline-heatmap.react';

import moment from 'moment';
import _minBy from 'lodash/minBy';

class TimelineChart extends React.Component {
  componentDidUpdate() {
    // $('[data-toggle="tooltip"]').tooltip({
    //   container: '.collapsed-content'
    // });
  }

  generateTitle(value) {
    if (value && value.date) {
      return `Chapter ${value.chapter} - ${value.date}`;
    }
  }

  render() {
    const endDate = moment(); // today.
    const end = new Date();
    const earliestDate = _minBy(this.props.values, 'ts');
    const earliest = earliestDate ? moment.unix(earliestDate.ts) : null;
    const days = earliest ? endDate.diff(earliest, 'days') + 30 : 100;
    return <TimelineHeatmap publishDate={this.props.publishDate} values={this.props.values}/>
  }
}

TimelineChart.propTypes = {
  values: PropTypes.array.isRequired,
  publishDate: PropTypes.number.isRequired
};

export default TimelineChart;