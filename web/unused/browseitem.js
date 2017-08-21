import React from 'react';

import CharacterLabel from '../components/library/character-label';

import uniqueId from 'lodash/uniqueId';

import ApiTimelineChart from 'components/chart/api-timeline-chart.react';
import TimelineChart from 'components/chart/timeline-chart.react';

class BrowseItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true
    }
  }

  render() {
    const fic = this.props.fic;
    const characterLabels = fic.characters.map((char) => {
      return (
        <CharacterLabel character={char}
                        key={uniqueId()}
                        onClick={() => { this.props.updateQuery({ characters: [char] }); }}/>
      );
    });
    const collapsedContent = (
      <div className="collapsed-content">
        <ApiTimelineChart fic={fic}/>
      </div>
    );
    const collapseLink = (
      <div className="collapse-link">
        <a onClick={() => this.setState({ collapsed: !this.state.collapsed })}>
          <i className={`${this.state.collapsed ? 'plus' : 'minus'} icon`}></i>
          { this.state.collapsed ? 'Expand' : 'Collapse' }
        </a>
      </div>
    );
    return(
      <div className="item">
        <div className="middle aligned content browse_item_content">
          <a className="header" href={"https://www.fanfiction.net" + fic.url }>{ fic.title }</a>
          <div className="meta"><span>{ fic.author }</span></div>
          <div className="description"><p>{ fic.summary }</p></div>
          <div>
            <div className="statistics">
            <div className="right floated">
              <div className="ui basic blue label"><i className="thumbs up icon"></i>{fic.fav_cnt.toLocaleString()}</div>
              <div className="ui basic red label"><i className="heart icon"></i>{fic.follow_cnt.toLocaleString()}</div>
              <div className="ui basic olive label"><i className="comment icon"></i>{fic.review_cnt.toLocaleString()}</div>
            </div>
            <div>
              <div className="ui basic violet label"><i className="tasks icon"></i>{fic.word_cnt.toLocaleString()}</div>
              <div className="ui basic teal label"><i className="book icon"></i>{fic.chapter_cnt.toLocaleString()}</div>
            </div>
            </div>
            <div className="right floated right aligned" style={{ fontSize: '.75rem' }}>
              Updated: {fic.update_date}<br/>
            Published: {fic.publish_date}
            </div>
            <div>
                {characterLabels}
            </div>
            { !this.state.collapsed && collapsedContent }
            { collapseLink }
          </div>
        </div>
    </div>
  );
  }
}

BrowseItem.propTypes = {
  fic: React.PropTypes.object.isRequired,
  highlight: React.PropTypes.array,
  updateQuery: React.PropTypes.func
};

BrowseItem.defaultProps = {
  updateQuery: () => {}
};

export default BrowseItem;
