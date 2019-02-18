import React from 'react';
import PropTypes from 'prop-types';

import CharacterLabel from 'components/common/character-label.react';
import FicSettingsButton from 'components/common/fic-settings-button.react';
import FicListItem from 'components/common/fic-list-item.react';

import ApiUtil from 'utils/api-util';

import _bind from 'lodash/bind';
import _isEqual from 'lodash/isEqual';

import 'styles/top/top-list.css'

class TopList extends React.Component {
  constructor(props) {
    super(props);

    this.handleKeypress = this.handleKeypress.bind(this);
    this.state =  {
      openIndex: -1
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_isEqual(nextProps.items, this.state.items)) {
      this.setState({ openIndex: -1 })
    }
  }

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
  }

  onAccordionOpen(openIndex) {
    this.setState({ openIndex });
  }

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

    $(window).keydown((e) => this.handleKeypress(e));
  }

  render() {
    let accordionContent = []

    this.props.items.forEach((fic, i) => {
      accordionContent.push(
        <div className="title" key={`${fic._id}_title`}>
          <span className="count">{fic.fav_cnt}</span><span className="innerTitle">{fic.title}</span>
        </div>
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
            <FicListItem fic={fic} showHeader={false}/>
        </div>
      );
    });

    return (
      <div className="top-list fic-list ui styled fluid accordion">
        { accordionContent }
      </div>
    );
  }
}

TopList.propTypes = {
  items: PropTypes.array.isRequired,
  update: PropTypes.func.isRequired,
}

TopList.defaultProps = {
  items: [],
  update: () => {}
}

export default TopList;
