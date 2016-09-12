var React = require("react");

var FFItem = React.createClass({
  render() {
    return (
      <div className={"ffitem" + ( this.props.selected ? " selected" : "")}>
        <div className={"ui" + (this.props.selected ? " selected" : "") + " raised card"}>
          <div className="content">
            <div className="header">
              <b className="title">{ this.props.data.title }</b><br/><span className="author">by { this.props.data.author }</span>
            </div>
          </div>

          <div className="content">
            <div className="summary">
              { this.props.data.summary }
            </div>
            <div className="details">
              <b>{ this.props.data.fandoms.join(", ") }</b> » { this.props.data.chars.join(", ") }
            </div>
          </div>

          <div className={"ui bottom "+ (this.props.selected ? " green" : " blue") + " button"} onClick={ this.read }>
              <i className="book icon"/>
              Read
          </div>
        </div>
      </div>
    );
  },
  read() {
    console.log("read");
    var inner = this.props.loadFicContent(this.props.data.title, 0);
  },
  next() {
    console.log("next");
  }
});

module.exports = FFItem
