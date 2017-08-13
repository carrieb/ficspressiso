import React from 'react';
import PropTypes from 'prop-types';

import ApiUtil from '../../api/util';

import moment from 'moment';

import TimelineChart from 'components/chart/timeline-chart.react';

class ApiTimelineChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timeline: []
    };
  }

  componentWillMount() {
    ApiUtil.getTimeline(this.props.id)
      .done((timeline) => {
        this.setState({ timeline });
      });
  }

  render() {
    return (
      <div className="api-timeline-chart">
        <TimelineChart values={
          this.state.timeline
            .filter((obj) => obj.earliestReview !== null)
            .map((obj) => {
              return {
                chapter: obj.chapter,
                ts: obj.earliestReview,
                date: moment.unix(obj.earliestReview).format('YYYY-MM-DD'),
                display: moment.unix(obj.earliestReview).format('ll')
              }
            })
        }/>
      </div>
    )
  }
}

ApiTimelineChart.propTypes = {
  id: PropTypes.number.isRequired
};

export default ApiTimelineChart;