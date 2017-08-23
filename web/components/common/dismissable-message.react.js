import React from 'react';

class DismissableMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { display: true }
  }
  
  componentWillMount() {
    console.log(window.localStorage.showBrowseWarning);
    if (window.localStorage.showBrowseWarning === 'false') {
      this.setState({ display: false });
    }
  }
  
  componentDidMount() {
    $(this.close).on('click', function() {
      window.localStorage.showBrowseWarning = false;
      $(this).closest('.message').transition('fade');
    })
  }

  render() {
    if (!this.state.showBrowseWarning) {
      return null;
    }
    
    return (
      <div className="ui warning icon message">
        <i className="close icon" ref={(ref) => this.close = ref}/>
        { this.props.children }
      </div>
    );
  }
}

export default DismissableMessage;