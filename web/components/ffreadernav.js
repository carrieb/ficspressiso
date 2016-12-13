var React = require("react"),
    Button = require("./button");

var FFReaderNav = React.createClass({
  showJumpModal() {
    $('.' + this.props.jumpCssClass + '.ui.modal').modal('show');
  },
  last() {
    this.props.jumpToChapter(this.props.lastChapter);
  },
  next() {
    var nextChapter = parseInt(this.props.currentChapter) + 1;
    this.props.jumpToChapter(nextChapter);
  },
  prev() {
    var previousChapter = parseInt(this.props.currentChapter) -1;
    this.props.jumpToChapter(previousChapter);
  },
  render() {
    var prev = (<Button key="prev" icon="arrow left" callback={ this.prev }/>);
    var jump = (<Button key="jump" icon="share square" callback={ this.showJumpModal }/>);
    var next = (<Button key="next" icon="arrow right" callback={ this.next }/>);
    var last = (<Button key="last" icon="fast forward" callback={ this.last }/>);
    var options = []
    if (this.props.currentChapter != 0) {
      options.push(prev);
    }
    options.push(jump);
    if (this.props.currentChapter != this.props.lastChapter) {
      options.push(next);
      options.push(last);
    }
    return (
      <div className="side_options ui vertical icon buttons">
        { options }
      </div>
    );
  }
});

module.exports = FFReaderNav
