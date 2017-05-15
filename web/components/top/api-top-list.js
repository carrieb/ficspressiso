import React from 'react';

import ApiUtils from '../../api/util';

import ApiMultipleCharacterDropdown from '../forms/ApiMultipleCharacterDropdown';
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
      fics: []
    };
  },

  componentWillMount() {
    this.updateData();
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
  },

  updateData() {
    ApiUtils.getTopData(
      this.state.characters,
      this.state.start,
      this.state.end,
      this.state.limit,
      this.state.sort
    ).done((fics) => {
        console.log(fics);
        this.setState({ fics });
      });
  },

  render() {
    return (
      <div className="api-top-list container">
        <TopList items={this.state.fics} update={this.updateData}/>
        <div className="top-list options-section" style={{ textAlign: 'center' }}>
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
          </form>
          <div className="center aligned">
            <button className="ui button purple" onClick={this.updateData}>reload</button>
          </div>
        </div>
      </div>
    );
  }
});

export default ApiTopList;
