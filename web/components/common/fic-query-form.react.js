import React from 'react';
import PropTypes from 'prop-types';

import ApiMultipleCharacterDropdown from 'components/forms/ApiMultipleCharacterDropdown';
import RatingDropdown from 'components/forms/rating-dropdown';
import CalendarInput from 'components/common/calendar-input.react';

import _clone from 'lodash/clone';

class FicQueryForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            query: _clone(this.props.query)
        };
    }

    updateQuery(field, value) {
        const q = this.state.query;
        q[field] = value;
        console.log(q);
        this.setState({ query: q });
        if (this.props.updateQuery) {
            this.props.updateQuery(q);
        }
    }

    render() {
        const form = (
            <form className="ui form">
                <div className="field">
                    <label>Characters</label>
                    <ApiMultipleCharacterDropdown
                        updateCharacters={(characters) => { this.updateQuery('characters', characters); }}
                        characters={this.state.query.characters} />
                </div>
                <div className="field">
                    <label>Rating</label>
                    <RatingDropdown
                        updateRating={(rating) => this.updateQuery('rating', rating)}
                        rating={this.state.query.rating}/>
                </div>
                <div className="field">
                    <div className="two fields">
                        <CalendarInput label="Start"
                                       onChange={(start) => this.updateQuery('start', start)}
                                       defaultValue={this.state.query.start} />
                        <CalendarInput label="End"
                                       onChange={(end) => this.updateQuery('end', end)}
                                       defaultValue={this.state.query.end} />
                    </div>
                </div>
                <div className="field">
                    <div className="two fields">
                        <div className="ui field">
                            <label>Min Words</label>
                            <input type="number" name="minWords" value={this.state.query.minWords}
                                   onChange={(ev) => this.updateQuery('minWords', ev.target.value)}/>
                        </div>
                        <div className="ui field">
                            <label>Max Words</label>
                            <input type="number" name="maxWords" value={this.state.query.maxWords}
                                   onChange={(ev) => this.setState('maxWords', ev.target.value )}/>
                        </div>
                    </div>
                </div>
            </form>
        );

        return (
            <div className="fic-query-form">
                { form }
            </div>
        )
    }
}

FicQueryForm.propTypes = {
    updateQuery: PropTypes.func,
    query: PropTypes.object
};

export default FicQueryForm;