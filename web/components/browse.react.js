import React from 'react';

import ApiFicList from 'components/common/api-fic-list.react';
import FicListItem from 'components/common/fic-list-item.react';
import FicQueryForm from 'components/common/fic-query-form.react';
import Paginator from 'components/common/paginator';
import DismissableMessage from 'components/common/dismissable-message.react';

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
      position: 'bottom right',
      on: 'click'
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
    console.log(this.state.query);
    return ApiUtils.browseFics(this.state.query);
  }

  goToPage(page) {
    const q = this.state.query;
    q.page = page;
    this.setState({ query: q });
  }

  render() {
    return (
      <div className="browse-container ui container">
        <div className="browse-header">
          <DismissableMessage>
            <div className="content">
              <div className="header">Query options limited.</div>
              <p>We're querying directly from fanfiction.net, so search is limited to their querying ability.</p>
            </div>
          </DismissableMessage>

          <button className="ui left floated blue icon button"
                  ref={(ref) => this.popupButton = ref}>
            <i className="filter icon"/>
          </button>
          <div ref={(ref) => this.popup = ref}
               className="ui flowing popup top left transition hidden">
            <FicQueryForm query={this.state.query}
                          updateQuery={(query) => this.setState({ query })}
            />
          </div>
          <button className="ui right floated green icon button"
                  onClick={() => this.list.loadFics()}>
            <i className="refresh icon"/>
          </button>

          <Paginator maxPage={25000}
                     page={this.state.query.page}
                     goToPage={(page) => this.goToPage(page)}
          />
        </div>
        
        <ApiFicList ref={(ref) => this.list = ref}
                    ficComponent={FicListItem}
                    requestFics={() => this.requestFics()}
                    query={this.state.query}/>
      </div>
    );
  }
}

export default BrowseDisplay;