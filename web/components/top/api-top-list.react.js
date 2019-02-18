import React from 'react';

import ApiUtils from 'utils/api-util';
import QueryUtil from 'utils/query-util.js';

import Paginator from 'components/common/paginator.react';
import TopList from './top-list.react';
import FicQueryForm from 'components/common/fic-query-form.react';

import 'styles/top/root.css';

import moment from 'moment';

class ApiTopList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sort: 'fav_cnt',
      query: QueryUtil.DEFAULT_TOP_QUERY,
      fics: [],
      page: 1,
      loading: false
    };
  }

  componentWillMount() {
    this.updateData(this.state.page);
  }

  componentDidMount() {
    $(window).keydown(this.handleKeypress);
  }

  handleKeypress(e) {
    const key = e.which;
    //console.log(e.which, this.state.openIndex);
    if (key === 37) { // left
      if (this.state.page !== 1) {
        this.paginate(this.state.page - 1)
        e.preventDefault();
      }
    }

    if (key === 39) { // right
      if (this.state.page !== 10) {
        this.paginate(this.state.page + 1)
        e.preventDefault()
      }
    }
  }

  paginate(page) {
    this.setState({ page });
    this.updateData(page);
  }

  updateData(page, callback) {
    this.setState({
      loading: true
    });

    ApiUtils.getTopData(
      this.state.query,
      this.state.sort,
      page || this.state.page
    ).done((fics) => {
        this.setState({ fics, loading: false });
        //console.log(callback);
        if (callback) {
          callback();
        }
      });
  }

  render() {
    const loader = this.state.loading ? (
      <div className="ui active inverted dimmer">
        <div className="ui loader"></div>
      </div>
    ) : null;

    const form = <FicQueryForm query={this.state.query} updateQuery={(query) => this.setState({ query })}/>;

    const options = (
      <div style={{ textAlign: 'center' }}>
        { form }
        <div className="center aligned">
          <button className="ui button purple" onClick={(ev) => this.updateData(1)}>reload</button>
        </div>
      </div>
    );

    return (
      <div className="api-top-list ui container">
        <div className="ui grid">
          <div className="ten wide column">
            { loader }
            <Paginator page={this.state.page} goToPage={(pg) => this.paginate(pg)} maxPage={10}/>
            <TopList items={this.state.fics} update={(callback) => this.updateData(null, callback)}/>
          </div>
          <div className="six wide column">
            { options }
          </div>
        </div>
      </div>
    );
  }
}

export default ApiTopList;
