import React from 'react';
import PropTypes from 'prop-types';

import ApiUtils from 'utils/api-util'

import _isEmpty from 'lodash/isEmpty';
import _noop from 'lodash/noop';

class ApiFandomDropdown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            fandomOptions: []
        };
    }

    componentWillMount() {
        this.loadFandomOptions();
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.loaded && this.state.loaded) {
            $(this.dropdown).dropdown({
                onChange: this.onChange,
                onLabelCreate: this.onLabelCreate
            });
        }
    }

    onChange = (valueString) => {
        if (!_isEmpty(valueString)) {
            this.props.updateFandoms(valueString.split(','));
        } else {
            this.props.updateFandoms([])
        }
    }

    onLabelCreate = (value, text) => {
        const fandom = value;
        return $(`<a class="ui label" data-value="${fandom}">${fandom}<i class="delete icon"></i></a>`);
    };

    loadFandomOptions = () => {
        this.setState({ loaded: false });

        ApiUtils.getFandoms()
            .done((fandomOptions) => {
                this.setState({ fandomOptions });
            }).always(() => {
                this.setState({ loaded: true });
            });
    }

    render() {
        const options = this.state.fandomOptions
            .map((fandom, idx) => {
                return (
                    <div className="item"
                         key={idx}
                         data-value={fandom.name}
                         data-text={fandom.name}
                         style={{ lineHeight: '20px' }}>
                        <div className="ui right floated mini teal label">{fandom.count}</div>
                        { fandom.name }
                    </div>
                );
            });

        return (
            <div className={`ui ${this.state.loaded ? '' : 'loading'} fluid multiple search selection dropdown`}
                 ref={(dropdown) => { this.dropdown = dropdown; }}>
                <input type="hidden" name="fandoms" value={this.props.fandoms.join(',')}/>
                <i className="dropdown icon"/>
                <div className="default text">Fandoms...</div>
                <div className="menu">
                    { options }
                </div>
            </div>
        );
    }
}

ApiFandomDropdown.propTypes = {
    fandoms: PropTypes.array.isRequired,
    updateFandoms: PropTypes.func.isRequired
};

ApiFandomDropdown.defaultProps = {
    fandoms: [],
    updateFandoms: _noop
}

export default ApiFandomDropdown;
