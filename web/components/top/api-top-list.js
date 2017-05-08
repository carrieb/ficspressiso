import React from 'react';

import ApiUtils from '../../api/util';

import ApiMultipleCharacterDropdown from '../forms/ApiMultipleCharacterDropdown';
import TopList from './top-list';

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
    $('.ui.accordion').accordion();
  },

  updateData() {
    ApiUtils.getTopData(
      this.state.characters,
      this.state.start,
      this.state.end,
      this.state.limit,
      this.state.sort
    ).done((fics) => {
        console.log(fics)
        this.setState({ fics });
      });
  },

  render() {
    return (
      <div className="api-top-list container">
        <TopList items={this.state.fics}/>
        <div className="top-list options-section">
          <form className="top-list ui form">
            <div className="field">
                <label>Characters</label>
                <ApiMultipleCharacterDropdown
                  updateCharacters={(characters) => { this.setState({ characters }); }}
                  characters={this.state.characters} />
            </div>
            <div className="field">
              <div className="two fields">
                <div className="field">
                  <label>Start</label>
                  <input type="text" name="start" value={this.state.start} onChange={(ev) => { const start = ev.target.value; this.setState({ start }); }}/>
                </div>
                <div className="field">
                  <label>End</label>
                  <input type="text" name="end" value={this.state.end} onChange={(ev) => { const end = ev.target.value; this.setState({ end }); }}/>
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
