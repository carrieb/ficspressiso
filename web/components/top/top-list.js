import React from 'react';

import CharacterLabel from 'components/common/character-label';
import FicSettingsButton from 'components/common/fic-settings-button';

import ApiUtil from 'api/util';

import _bind from 'lodash/bind';
import _isEqual from 'lodash/isEqual';

const TopList = React.createClass({
  propTypes: {
      items: React.PropTypes.array.isRequired,
      update: React.PropTypes.func.isRequired,
  },

  getDefaultProps() {
    return {
      items: [],
      update: () => {}
    };
  },

  getInitialState() {
    return {
      openIndex: -1
    }
  },

  componentWillReceiveProps(nextProps) {
    if (!_isEqual(nextProps.items, this.state.items)) {
      this.setState({ openIndex: -1 })
    }
  },

  handleKeypress(e) {
    const key = e.which;
    //console.log(e.which, this.state.openIndex);
    if (key === 40) { //down
      if (this.state.openIndex < this.props.items.length - 1) {
        this.setState({
          openIndex: this.state.openIndex + 1
        });
        $('.ui.accordion').accordion('open', this.state.openIndex)
        e.preventDefault();
      }
    }

    if (key === 38) { // up
      if (this.state.openIndex > 0) {
        this.setState({
          openIndex: this.state.openIndex - 1
        });
        $('.ui.accordion').accordion('open', this.state.openIndex)
        e.preventDefault()
      }
    }
  },

  onAccordionOpen(openIndex) {
    this.setState({ openIndex });
  },

  componentDidMount() {
    const onChange = (function (component) {
      return function() {
        //console.log(this);
        const openIndex = $(this).data('index');
        //console.log(component);
        component.onAccordionOpen(openIndex);
      };
    })(this);
    $('.ui.accordion').accordion({
      onChange
    });

    $(window).keydown(this.handleKeypress);
  },

  render() {
    let accordionContent = []
    this.props.items.forEach((fic, i) => {
      accordionContent.push(
        <div className="title" key={`${fic._id}_title`}>
          <span className="count">{fic.fav_cnt}</span><span className="innerTitle">{fic.title}</span>
        </div>
      );
      let characterLabels = fic.characters.map((character) =>
        <CharacterLabel key={`${fic._id}_${character}`} character={character}/>
      );
      let reindex = (callback) => {
        //console.log(fic.url);
        ApiUtil.reindex(fic.url)
        .done((res) => {
          $('.ui.accordion').accordion('refresh');
          this.props.update(callback);
        });
      }
      accordionContent.push(
        <div className="content" key={`${fic._id}_content`} data-index={i}>
            <p><b>by <a href={'https://www.fanficiton.net' + fic.author_url}>{fic.author}</a></b></p>
            <p>{fic.rating}</p>
            <p style={{ textAlign: 'justify', marginBottom: '25px' }}>{fic.summary}</p>
            <div style={{ marginBottom: '20px' }}>{ characterLabels }</div>
            <div style={{ marginBottom: '15px' }}><b>{fic.word_cnt}</b> <span style={{paddingLeft:'20 px'}}>{fic.publish_date} - {fic.update_date}</span></div>
            <div><FicSettingsButton reindex={reindex}/><a className="ui green button" href={fic.url} target="_blank">GO</a></div>
        </div>
      );
    });
    return (
      <div className="top-list fic-list ui styled fluid accordion">
        { accordionContent }
      </div>
    )
  }
});

export default TopList;
