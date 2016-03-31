var React = require('react');

var FFJumpModal = React.createClass({
  doJump() {
    var rawChapter = $('#chapter_select').val();
    console.log('[jumpmodal] jump', rawChapter);
    this.props.jumpToChapter(rawChapter);
  },
  render() {
    var chapterOptions = [];
    for (var i = 0; i < this.props.chapterOptions.length; i++) {
      var chapter = this.props.chapterOptions[i];
      chapterOptions.push(
        <option value={ i } key={ i }>{ chapter['title'] }</option>
      );
    }
    return (
      <div className={ "ui modal " + this.props.cssClass }>
        <div className="header">Jump to Chapter</div>
        <div className="content">
          <div className="ui form">
            <div className="field">
              <label>Chapter</label>
              <select id="chapter_select" className="ui search dropdown">
                <option value="">Select Chapter</option>
                { chapterOptions }
              </select>
            </div>
          </div>
        </div>
        <div className="actions">
          <div className="ui black deny button">
            Cancel
          </div>
          <div className="ui positive right labeled icon button">
            <i className="share square icon"/>
            Jump
          </div>
        </div>
      </div>
    );
  },
  componentDidMount() {
    $('.' + this.props.cssClass + '.ui.modal').modal({
      onApprove: this.doJump,
      detachable: false
    });
    $('#chapter_select.ui.dropdown').dropdown({
      showOnFocus: false,
      duration: 100
    });
  }
});

module.exports = FFJumpModal
