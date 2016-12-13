var React = require("react"),
    FFReaderNav = require("./ffreadernav"),
    FFJumpModal = require("./ffjumpmodal");

var FFReader = React.createClass({
  render() {
    var jumpCssClass = "jump";
    var ficLabel = (
      <div className="ui large teal bottom right attached label">
        {this.props.ficTitle}
        <div className="detail">{this.props.currentChp + 1}/{this.props.lastChp + 1}</div>
      </div>
    );
    var content = (
      <div className="fic_content ui very padded text segment">
        <div style={{ textAlign: "center"}}>
          <h2>{ this.props.chpTitle }</h2>
        </div>
        { this.props.content }
      </div>
    );
    var side_options = null,
        jump_modal = null;
    if (this.props.content.length > 0) {
      side_options = (
        <FFReaderNav jumpToChapter={ this.props.loadFicContent }
                     currentChapter={ this.props.currentChp }
                     lastChapter={ this.props.lastChp }
                     jumpCssClass={ jumpCssClass }/>
      );
      jump_modal = (
        <FFJumpModal jumpToChapter={ this.props.loadFicContent }
                     chapterOptions={ this.props.chapters }
                     cssClass={ jumpCssClass }/>
      );
    }
    return (
      <div className="fic_reader">
        { this.props.content.length > 0 ?  content : null }
        { side_options }
        { jump_modal }
        { this.props.content.length > 0 ? ficLabel : null }
      </div>
    );
  }
});

module.exports = FFReader
