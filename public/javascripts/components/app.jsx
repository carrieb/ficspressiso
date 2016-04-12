var React = require("react"),
    Library = require("./library"),
    Browse = require('./browse');

var App = React.createClass({
  setActive(ev) {
    this.setState({
      section: ev.target.textContent
    });
  },
  getInitialState() {
    return {
      section: this.props.initialSection
    }
  },
  render() {
    sections = ["Library", "Browse"];
    sectionContent = '';
    sectionEls = sections.map((section) => {
      selected = (section === this.state.section ? " active" : "");
      return (<a className={ "ui item" + selected } onClick={ this.setActive } key={ section }>{ section }</a>);
    });
    if (this.state.section === "Library") {
      sectionContent = (<Library/>);
    } else if (this.state.section === "Browse") {
      sectionContent = (<Browse/>);
    }
    console.log(this.state.section, sectionContent);
    return (<div>
      <div className="ui teal large secondary pointing menu" style={{ marginBottom: '20px' }}>
        { sectionEls }
        <div className="right menu">
          <a className={ "ui item" + (this.state.section === "Settings" ? " active": "") } onClick={ this.setActive } key="Settings">Settings</a>
        </div>
      </div>
      { sectionContent }
    </div>);
  }
});

module.exports = App;
