import React from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';

class CalendarInput extends React.Component {
    componentDidMount() {
        $(this.input).calendar({
            type: 'date',
            startMode: 'year',
            today: true,
            formatter: {
                date: (date) => {
                    const d = moment(date);
                    return d.format('YYYY-MM-DD');
                }
            },

            onChange: (date, text) => {
                this.props.onChange(text);
            },

            popupOptions: {
                position: 'bottom center'
            }
        });
    }

    render() {
        return (
            <div className="ui calendar field calendar-input" ref={(input) => this.input = input}>
                <label>{this.props.label}</label>
                <input type="text" defaultValue={this.props.defaultValue} />
            </div>
        );
    }
}

CalendarInput.propTypes = {
    label: PropTypes.string.isRequired,
    defaultValue: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

CalendarInput.defaultProps = {
    defaultValue: '2000-01-01'
};

export default CalendarInput;