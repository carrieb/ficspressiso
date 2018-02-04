import React from 'react';
import { render } from 'react-dom';

import $ from 'jquery';

import StarSelector from 'components/common/star-rater.react.js';

class AO3Footer extends React.Component {
  render() {
    return <div className="rating-footer">
      <div className="inner">
        <div className="content">
          <button onClick={this.submitFeedback}>Backup to Ficspressiso</button>
        </div>
      </div>
    </div>;
  }
}


class WorkSummary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fic: {}
    }
  }

  componentWillMount() {
    console.log('mounting');
    const id = this.extractID();
    chrome.runtime.sendMessage({ messageType: 'LOOKUP_FIC', id }, (response) => {
      console.log(response.result);
      if (response.result) {
        this.setState({
          fic: response.result
        });
      } else {
        this.extractFicFromPage();
      }
    });
  }

  submitFeedback = () => {
      console.log('submit');

      const fic = {}; // TODO: parse fic from dom
      const feedback = {}; // TODO: based on my current state

      // TODO: send message to extension to save feedback
      chrome.runtime.sendMessage({ messageType: 'SUBMIT_FEEDBACK', fic, feedback }, (response) => {
          console.log(response.result || response.error);
      });
  };

  extractID = () => {
    const url = window.location.href;
    const idRegex = new RegExp('https:\/\/archiveofourown\.org\/works\/(\\d+)\/chapters\/.*', 'g');
    const m = idRegex.exec(url);
    const id = parseInt(m[1]);
    return id;
  };

  extractFicFromPage = () => {
    console.log('extracting...');
    const id = this.extractID();
    const title = $('.work h2.title').text().trim();
    const url = `https://archiveofourown.org/works/${id}`;
    const author = $('.work a[rel="author"]').text();
    const authorUrl = `https://archiveofourown.org${$('.work a[rel="author"]').attr('href')}`;
    const fandoms = $('.work .fandom.tags a').text();

    //const summary = $('.work .summary blockquote').text();

    const fic = { ao3_id: id, title, url, author, author_url: authorUrl, fandoms };
    chrome.runtime.sendMessage({ messageType: 'SUBMIT_FIC', fic }, (response) => {
      console.log(response.result);
      this.setState({
        fic: response.result
      });
    });
  };

  render() {
    return <div className="ficspressiso-work-summary wrapper">
      <div className="content">
        <div className="rater">
          <label>Rating:</label>
          <StarSelector value={3}/>
        </div>
        <div>
          Notes:
          <textarea className="ui input"></textarea>
          <button className="ui fluid button">Save Feedback</button>
        </div>
      </div>
    </div>;
  }
}

// const div = document.createElement('div');
// render(<AO3Footer/>, div)
// document.body.appendChild(div);

const workMeta = document.querySelectorAll('.work.meta')[0];
const summaryDiv = document.createElement('div');
render(<WorkSummary/>, summaryDiv);
workMeta.parentNode.parentNode.insertBefore(summaryDiv, workMeta.parentNode.nextSibling);

const footerDiv = document.createElement('div');
footerDiv.classList.add('ficspressiso-footer');
render(<AO3Footer/>, footerDiv);
document.body.appendChild(footerDiv);

$('.share').hide();
$('.chapter.entire').hide();
$('.post.comment').hide();
$('#footer').hide();
$('.kudos').hide();

$('.work.actions').css('margin-bottom', '20px');

$('.primary.actions .dropdown').hide();
