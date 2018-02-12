import React from 'react';
import { render } from 'react-dom';

import StarSelector from 'components/common/star-rater.react.js';

const extractID = function() {
  const url = window.location.href;
  const idRegex = new RegExp('https:\/\/archiveofourown\.org\/works\/(\\d+)\/chapters\/.*', 'g');
  const m = idRegex.exec(url);
  const id = parseInt(m[1]);
  return id;
};

class AO3Footer extends React.Component {
  constructor(props) {
    super(props);

    const chaptersStr = $('dd.chapters').text();
    const split = chaptersStr.split('/').map((str) => str.trim());
    const current = parseInt(split[0].trim());

    this.state = {
      downloading: false,
      progress: 0,
      total: current
    }
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevState, this.state);
    if (this.state.downloading && !prevState.downloading) {
      console.log('initializing progress');
      $('.progress').progress({
        total: this.state.total,
        value: this.state.progress,
        text: {
          active: '{value} of {total} Chapters Downloaded'
        }
      });
    } else if (this.state.downloading) {
      $('.progress').progress('set progress', this.state.progress);
    }
  }

  download = () => {
    this.setState({ downloading: true });

    chrome.runtime.onMessage.addListener(
      (request, sender, sendResponse) => {
        console.log(request);
        const progress = parseInt(request);
        this.setState({
          progress
        });
      });

    chrome.runtime.sendMessage({
      messageType: 'DOWNLOAD',
      site: 'ao3',
      id: extractID()
    }, (response) => {
      console.log(response);
    });
  };

  render() {
    let progress;
    if (this.state.downloading) {
      progress = (
        <div className="ui indicating progress" data-value={this.state.progress} data-total={this.state.total}>
          <div className="bar">
            <div className="progress"></div>
          </div>
          <div className="label">Downloading</div>
        </div>
      );
    }

    return <div className="ao3-work-footer">
      <div className="inner">
        <div className="content">
          <button onClick={this.download}>Backup to Ficspressiso</button>
          { progress }
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
    const id = extractID();
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

  extractFicFromPage = () => {
    console.log('extracting...');
    const id = extractID();
    const title = $('.work h2.title').text().trim();
    const url = `https://archiveofourown.org/works/${id}`;
    const author = $('.work a[rel="author"]').text();
    const authorUrl = `https://archiveofourown.org${$('.work a[rel="author"]').attr('href')}`;
    const fandoms = $('.work .fandom.tags a').text();

    const chaptersStr = $('dd.chapters').text();
    const split = chaptersStr.split('/').map((str) => str.trim())
    const current = parseInt(split[0].trim());
    const forecastTotal = split[1] === '?' ? null : parseInt(split[1]);

    //const summary = $('.work .summary blockquote').text();

    const fic = { ao3_id: id, title, url, author, author_url: authorUrl, fandoms };
    chrome.runtime.sendMessage({ messageType: 'SUBMIT_FIC', fic }, (response) => {
      console.log(response.result);
      // this.setState({
      //   fic: response.result
      // });
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

console.log('ficspressiso running');

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
