import React from 'react';

import ApiUtils from 'api/util.js'

import FicQueryForm from 'components/common/fic-query-form.react';
import Chart from 'components/common/chart.react';

import ChartUtil from 'utils/chart-util';
import QueryUtil from 'utils/query-util';

import 'styles/chart/chart.css';

class ChartDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: QueryUtil.DEFAULT_CHART_QUERY,
      data: {},
      loaded: false
    }
  }

  componentWillMount() {
    this.updateData();
  }

  updateData() {
    this.setState({
      loaded: false
    });
    ApiUtils.getChartData(this.state.query)
      .done((data) => {
        ChartUtil.addStyleToDatasets(data.datasets);
        this.setState({ data, loaded: true });
      });
  }

  render() {
    return (
      <div className="ui container chart-wrapper">
        <div className="ui basic segment api-fics-per-character-chart-container">
          { !this.state.loaded && <div className="ui active large text loader">Loading..</div> }
          <Chart data={this.state.data}/>
        </div>
        <div>
          <FicQueryForm query={this.state.query}
                        updateQuery={(query) => this.setState({ query })}/>
          <div className="text-center">
            <button className="ui button purple reload-button"
                    onClick={() => this.updateData()}>reload</button>
          </div>
        </div>
      </div>
    )
  }
}

export default ChartDisplay;
