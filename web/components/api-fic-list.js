import React from 'react';

import ApiUtils from '../api/util.js';

import BrowseItem from './browseitem.js';
import LoadingBar from './loading/loading-bar.js';

import isEqual from 'lodash/isEqual';

const ApiFicList = React.createClass({
  propTypes: {
    currentQuery: React.PropTypes.object.isRequired, /* of the form { page: 1, characters: [] } */
    updateQuery: React.PropTypes.func
  },

  getInitialState() {
    return {
      fics: [],
      loaded: false
    }
  },

  componentWillMount() {
    if (!this.state.loaded) {
      this.requestContent();
    }
  },

  componentWillReceiveProps(newProps) {
    console.log('new props', newProps.currentQuery, this.props.currentQuery, isEqual(newProps.currentQuery, this.props.currentQuery));
    if (!isEqual(newProps.currentQuery, this.props.currentQuery)) {
      this.requestContent(newProps.currentQuery);
    }
  },

  requestContent(query = this.props.currentQuery) {
    this.setState({
      loaded: false
    });
    ApiUtils.browseFics(query)
      .done((fics) => {
        console.log(fics);
        this.setState({
          fics,
          loaded: true
        });
        this.props.onLoaded();
    });
  },

  render() {
    let content = null;
    if (this.state.loaded) {
      const browseItems = this.state.fics.map((fic, idx) => {
        return (
          <BrowseItem key={idx}
                      fic={fic}
                      highlight={this.props.currentQuery.characters}
                      updateQuery={this.props.updateQuery}/>
        );
      });
      content = (
        <div className="ui relaxed items">
          { browseItems }
        </div>
      );
    }
    return (
      <div className="api-fic-list-container">
        {!this.state.loaded && <LoadingBar/>}
        {content}
      </div>
    );
  }
});

export default ApiFicList;
