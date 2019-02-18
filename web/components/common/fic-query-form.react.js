import React from 'react';
import PropTypes from 'prop-types';

import ApiMultipleCharacterDropdown from 'components/forms/api-multi-char-dropdown.react';
import RatingDropdown from 'components/forms/rating-dropdown.react';
import ApiFandomDropdown from 'components/forms/api-fandom-dropdown.react';
import CalendarInput from 'components/common/calendar-input.react'

import QueryUtil from 'util/query-util';

import _clone from 'lodash/clone';

// TODO: add additional fields based on selected site. 

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

    siteButton = (site) => {
        let classes = ['ui button'];
        if (this.state.query.sites.indexOf(site) > -1) {
            classes.push('blue');
        } else {
            classes.push('basic blue');
        }

        const onClick = (site) => {
            return (ev) => {
                let sites = this.state.query.sites;
                const idx = sites.indexOf(site);
                const currentlySelected = idx > -1;

                if (this.props.allowMultipleSites) {
                    if (currentlySelected) {
                        sites.splice(idx, 1); // remove site
                        ev.preventDefault();
                        this.updateQuery('sites', sites);
                    } else {
                        sites.push(site); // add site
                        ev.preventDefault();
                        this.updateQuery('sites', sites);
                    }
                } else {
                    if (currentlySelected) {
                        // do nothing
                        ev.preventDefault();
                    } else {
                        this.updateQuery('sites', [ site ]);
                        ev.preventDefault();
                    }
                }


            }
        };

        return <button key={site}
                       className={classes.join(' ')}
                       onClick={onClick(site)}>
            { site }
        </button>;
    };

    render() {
        console.log('FicQueryForm', this.props.query);
        const form = (
            <form className="ui form">
                <div className="field">
                    <label>Sites</label>
                    <div className="ui two fluid buttons">
                        { this.siteButton('fanfiction.net') }
                        { this.siteButton('ao3.org') }
                    </div>
                </div>

                <div className="field">
                    <label>Fandoms</label>
                    <ApiFandomDropdown fandoms={this.state.query.fandoms}
                                       updateFandoms={(fandoms) => { this.updateQuery('fandoms', fandoms); }}/>
                </div>

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
                            <input type="number"
                                   name="minWords"
                                   value={this.state.query.minWords}
                                   onChange={(ev) => this.updateQuery('minWords', ev.target.value)}/>
                        </div>
                        <div className="ui field">
                            <label>Max Words</label>
                            <input type="number"
                                   name="maxWords"
                                   value={this.state.query.maxWords}
                                   onChange={(ev) => this.updateQuery('maxWords', ev.target.value )}/>
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
    query: PropTypes.object,
    allowMultipleSites: PropTypes.bool
};

FicQueryForm.defaultProps = {
    query: QueryUtil.DEFAULT_EMPTY_QUERY,
    allowMultipleSites: false
}

export default FicQueryForm;
