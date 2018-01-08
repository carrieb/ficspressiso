import React from 'react';
import { render } from 'react-dom';

import $ from 'jquery';

import StarSelector from 'components/common/star-rater.react.js';

class AO3Footer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fic: {},
      feedback: {}
    }
  }

  componentWillMount() {
    // TODO: attempt to parse fic from page
    // TODO: see if we have it already stored
  }

  submitFeedback = () => {
    console.log('submit');

    const fic = {}; // TODO: parse fic from dom
    const feedback = {}; // TODO: based on my current state

    // TODO: send message to extension to save feedback
    chrome.runtime.sendMessage({ fic, feedback }, (response) => {
      console.log(response.result || response.error);
    });
  }

  render() {
    return <div className="rating-footer">
      <div className="inner">
        <div className="content">
          <div className="rater">
            <label>Rating:</label>
            <StarSelector value={3}/>
          </div>
          <button onClick={this.submitFeedback}>Submit</button>
        </div>
      </div>
    </div>;
  }
}

const div = document.createElement('div');
render(<AO3Footer/>, div)
document.body.appendChild(div);
