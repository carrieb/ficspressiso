import React from 'react';
import PropTypes from 'prop-types';

import CalendarHeatmap from 'react-calendar-heatmap';

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
    console.log(this.props.values);
    const earliestDate = _minBy(this.props.values, 'ts');
    const earliest = earliestDate ? moment.unix(earliestDate.ts) : null;
    const days = earliest ? endDate.diff(earliest, 'days') + 30 : 100;
    // TODO: stop using this it's a piece of crap
    return (
      <CalendarHeatmap
        endDate={end}
        numDays={days}
        values={this.props.values}
        titleForValue={(value) => this.generateTitle(value)}
        tooltipDataAttrs={{ 'data-toggle': 'tooltip' }}
      />
    )
  }
}

TimelineChart.propTypes = {
  values: PropTypes.array.isRequired
};

export default TimelineChart;