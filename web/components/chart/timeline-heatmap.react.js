import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

import _maxBy from 'lodash/maxBy';
import _sortBy from 'lodash/sortBy';

class TimelineHeatmap extends React.Component {
  render() {
    console.log(this.props.publishDate);
    const publish = moment.unix(this.props.publishDate).startOf('day');
    const now = moment().startOf('day');

    const duration = moment.duration(now.diff(publish));
    const days = duration.asDays();

    const units = days < 100 ? days : 100;
    const delta = days < 100 ? 1 : (days * 1.0)/100;
    const rawPerc = ((delta * 1.0) / units) * 100;
    const perc = days > 100 ? 1 : +(rawPerc.toFixed(2));

    console.log(days, units, delta, perc);
    
    const dateToData = {};

    // split up into day units.
    const start = publish.clone();
    while (start.isBefore(now)) {
      dateToData[start.unix()] = {
        count: 0,
        readable: start.format('l')
      };
      // TODO: this doesn't work quite right
      // extra space + not enough space
      // change to using straight up ms values
      start.add(delta, 'days');
    }

    console.log(dateToData);

    const dataPoints = _sortBy(this.props.values, 'ts');

    const rangeStart = publish.clone();
    const rangeEnd = rangeStart.clone().add(delta, 'days');

    dataPoints.forEach((value) => {
      //console.log(value);
      //console.log(value.ts);
      const m = moment.unix(value.ts).startOf('day');
      //console.log(m.format('llll'), rangeStart.format('llll'), rangeEnd.format('llll'))
      while (!m.isBefore(rangeEnd) && rangeStart.isBefore(now)) {
        rangeStart.add(delta, 'days');
        rangeEnd.add(delta, 'days');
      }

      //console.log(m.format('llll'), rangeEnd.format('llll'));

      dateToData[rangeStart.unix()].count++;
    });


    console.log(dateToData, Object.keys(dateToData).length);

    const max = _maxBy(Object.values(dateToData), 'count').count;

    const filledRects = Object.keys(dateToData).map((date, idx) => {
      //console.log(date, idx, perc);
      const x = idx * perc;
      const value = dateToData[date];
      const opacity = max > 0 ? value.count/max : 0;
      //console.log(x, perc);
      return (
        <rect key={idx}
              x={`${x}%`}
              y="20"
              height="50"
              width={`${perc}%`}
              style={{
                strokeWidth: '0.15', stroke: 'gray',
                fill: 'green', fillOpacity: opacity
              }}>
          <title>{value.readable}: {value.count} reviews</title>
        </rect>
      )
    });

    return (
      <div className="timeline-heatmap">
        <svg width="100%" height="75">
          <rect x="0" y="20" width="100%" height="50" style={{
            fill: 'white', fillOpacity: '0', strokeWidth: '0.25', stroke: 'black'
          }}/>
          { filledRects }
        </svg>
      </div>
    )
  }
}

TimelineHeatmap.propTypes = {
  values: PropTypes.array,
    publishDate: PropTypes.number
};

TimelineHeatmap.defaultProps = {
  values: [],
    publishDate: 'default publish date'
};

export default TimelineHeatmap;