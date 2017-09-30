import React from 'react';
import PropTypes from 'prop-types';

import ApiUtil from 'utils/api-util';

import moment from 'moment';

import _uniqBy from 'lodash/uniqBy'

import TimelineChart from 'components/chart/timeline-chart.react';

class ApiTimelineChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timeline: []
    };
  }

  componentWillMount() {
    ApiUtil.getTimeline(this.props.fic.id)
      .done((timeline) => {
        this.setState({ timeline });
      });
  }

  render() {
    return (
      <div className="api-timeline-chart">
        <TimelineChart values={
          this.state.timeline
        } publishDate={this.props.fic.publish_ts}/>
      </div>
    )
  }
}

ApiTimelineChart.propTypes = {
  fic: PropTypes.object.isRequired
};

export default ApiTimelineChart;