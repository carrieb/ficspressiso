import React from 'react';

import ApiUtils from '../../api/util';

import ApiMultipleCharacterDropdown from '../forms/ApiMultipleCharacterDropdown';
import Paginator from '../common/paginator';
import TopList from './top-list';

import moment from 'moment';

const ApiTopList = React.createClass({
  getInitialState() {
    return {
      characters: [],
      start: '2016-01-01',
      end: '2016-12-31',
      limit: 10,
      sort: 'fav_cnt',
      minWords: 0,
      maxWords: 10000000, // ten million
      fics: [],
      page: 1,
      loading: false
    };
  },

  componentWillMount() {
    this.updateData(this.state.page);
  },

  componentDidMount() {
    $('#startDate').calendar({
      type: 'date',
      startMode: 'year',
      today: true,
      formatter: {
        date: (date, settings) => {
          const d = moment(date);
          return d.format('YYYY-MM-DD');
        }
      },
      onChange: (date, text, mode) => {
        console.log(date, text, mode);
        this.setState({ start: text });
      },
      popupOptions: {
        position: 'top center'
      }
    });
    // value={this.state.start} onChange={(ev) => { const start = ev.target.value; this.setState({ start }); }
    $('#endDate').calendar({
      type: 'date',
      startMode: 'year',
      today: true,
      formatter: {
        date: (date, settings) => {
          const d = moment(date);
          return d.format('YYYY-MM-DD');
        }
      },
      onChange: (date, text, mode) => {
        console.log(date, text, mode);
        this.setState({ end: text });
      },
      popupOptions: {
        position: 'top center'
      }
    });
    // value={this.state.end} onChange={(ev) => { const end = ev.target.value; this.setState({ end }); }}

    $(window).keydown(this.handleKeypress);
  },

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
  },

  paginate(page) {
    this.setState({ page });
    this.updateData(page);
  },

  updateData(page, callback) {
    this.setState({
      loading: true
    });
    ApiUtils.getTopData(
      this.state.characters,
      this.state.start,
      this.state.end,
      this.state.limit,
      this.state.minWords,
      this.state.maxWords,
      this.state.sort,
      page || this.state.page
    ).done((fics) => {
        console.log(fics);
        this.setState({ fics, loading: false });
        console.log(callback);
        if (callback) {
          callback();
        }
      });
  },

  render() {
    const loader = this.state.loading ? (
      <div className="ui active inverted dimmer">
        <div className="ui loader"></div>
      </div>
    ) : null;
    return (
      <div className="api-top-list ui basic segment">
        { loader }
        <div className="options-section ui right dividing rail">
          <div className="ui basic segment">
            { loader }
            <div style={{ textAlign: 'center' }}>
              <form className="top-list ui form">
                <div className="field">
                    <label>Characters</label>
                    <ApiMultipleCharacterDropdown
                      updateCharacters={(characters) => { this.setState({ characters }); }}
                      characters={this.state.characters} />
                </div>
                <div className="field">
                  <div className="two fields">
                    <div className="ui calendar field" id="startDate">
                      <label>Start</label>
                      <input type="text" name="start" value={this.state.start} />
                    </div>
                    <div className="ui calendar field" id="endDate">
                      <label>End</label>
                      <input type="text" name="end" value={this.state.end} />
                    </div>
                  </div>
                </div>
                <div className="field">
                  <div className="two fields">
                    <div className="ui field">
                      <label>Min Words</label>
                      <input type="number" name="minWords" value={this.state.minWords}
                             onChange={(ev) => this.setState({ minWords : ev.target.value })}/>
                    </div>
                    <div className="ui field">
                      <label>Max Words</label>
                      <input type="number" name="maxWords" value={this.state.maxWords}
                             onChange={(ev) => this.setState({ maxWords : ev.target.value })}/>
                    </div>
                  </div>
                </div>
              </form>
              <div className="center aligned">
                <button className="ui button purple" onClick={(ev) => this.updateData(1)}>reload</button>
              </div>
            </div>
          </div>
        </div>
        <Paginator page={this.state.page} goToPage={this.paginate} maxPage={10}/>
        <TopList items={this.state.fics} update={(callback) => this.updateData(null, callback)}/>
      </div>
    );
  }
});

export default ApiTopList;
