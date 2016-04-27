var React = require("react"),
    Library = require("./library"),
    Browse = require('./browse'),
    ChartApp = require('./chartapp');

var App = React.createClass({
  componentDidMount() {
    if (this.state.section === "Library") {
      this.setState({
        library: (<Library/>)
      });
    } else if (this.state.section === "Browse") {
      this.setState({
        browse: (<Browse/>)
      });
    } else if (this.state.section === "Chart") {
      this.setState({
        chart: (<ChartApp renderChart={this.props.renderChart}/>)
      });
    }
  },
  setActive(ev) {
    var section = ev.target.textContent;
    if (section === "Library") {
      var library = this.state.library;
      if (library == null) {
        library = (<Library/>);
      }
      this.setState({
        library: library,
        section: section
      });
    } else if (section === "Browse") {
      var browse = this.state.browse;
      if (browse == null) {
        var browse = (<Browse/>);
      }
      this.setState({
        browse: browse,
        section: section
      });
    } else if (section === "Chart") {
      var chart = this.state.chart;
      if (chart == null) {
        var chart = (<ChartApp renderChart={this.props.renderChart}/>);
      }
      this.setState({
        chart: chart,
        section: section
      });
    }
  },
  getInitialState() {
    return {
      section: this.props.initialSection,
      library: null,
      browse: null,
      chart: null
    }
  },
  render() {
    sections = ["Library", "Browse", "Chart"];
    sectionContent = '';
    sectionEls = sections.map((section) => {
      selected = (section === this.state.section ? " active" : "");
      return (<a className={ "ui item" + selected } onClick={ this.setActive } key={ section }>{ section }</a>);
    });
    if (this.state.section === "Library") {
      sectionContent = this.state.library;
    } else if (this.state.section === "Browse") {
      sectionContent = this.state.browse;
    } else if (this.state.section === "Chart") {
      sectionContent = this.state.chart
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
