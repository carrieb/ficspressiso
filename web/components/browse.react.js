import React from 'react';

import ApiFicList from 'components/common/api-fic-list.react';
import FicListItem from 'components/common/fic-list-item.react';
import FicQueryForm from 'components/common/fic-query-form.react';
import Paginator from 'components/common/paginator';

import ApiUtils from 'api/util';

import QueryUtil from 'utils/query-util';

import 'styles/browse/browse.css';

class BrowseDisplay extends React.Component {
  constructor(props) {
    super(props);

    const query = QueryUtil.browseQueryFromLocation(props.location);
    this.state = { query };
  }

  componentDidMount() {
    $(this.popupButton).popup({
      on: 'click', position: 'bottom right'
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      const query = QueryUtil.browseQueryFromLocation(nextProps.location);
      this.setState({ query });
    }
  }

  next() {
    this.setState({
      page: this.state.page + 1
    });
  }

  requestFics() {
    return ApiUtils.browseFics(this.state.query);
  }

  render() {
    return (
      <div className="browse-container ui container">
        <div className="ui warning icon message">
          <i className="close icon"/>
          <div className="content">
            <div className="header">Query options limited.</div>
            <p>We're querying directly from fanfiction.net, so search is limited to their querying ability.</p>
          </div>
        </div>

        <button className="ui right floated blue icon button"
             ref={(ref) => this.popupButton = ref}>
          <i className="filter icon"/>
        </button>
        <div className="ui flowing popup top left transition hidden">
          <FicQueryForm query={this.state.query}
                        updateQuery={(q) => console.log(q)}
          />
        </div>

        <Paginator/>

        <ApiFicList ficComponent={FicListItem}
                    requestFics={() => this.requestFics()}
                    query={this.state.query}/>
      </div>
    );
  }
}

export default BrowseDisplay;