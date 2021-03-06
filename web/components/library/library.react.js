import React from 'react';
import PropTypes from 'prop-types';

import Filter from 'components/library/filter.react';
import Sort from 'components/sort/sort';
import CharacterLabel from 'components/common/character-label.react';
import FicListItem from 'components/common/fic-list-item.react';

import ApiUtil from 'util/api-util';

import sortBy from 'lodash/sortBy';
import uniqueId from 'lodash/uniqueId';

import 'styles/library/library.css';

class Library extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            query: {},
            sort: {
                by: 'title',
                order: 'ascending'
            },
            library: [],
            loaded: false
        };
    }

    componentWillMount() {
        this.loadLibrary()
    }

    loadLibrary = () => {
        this.setState({ loaded: false })

        ApiUtil.getLibrary()
            .done((library) => {
                this.setState({ library });
            })
            .always(() => {
                this.setState({ loaded: true })
            });
    };

    storiesForQuery() {
        const query = this.state.query;
        const filtered = this.state.library.filter((story) => {
            let matchesQuery = true;
            if (query.fandoms) {
                matchesQuery = matchesQuery && (query.fandoms === story.fandom);
            }
            if (query.characters) {
                matchesQuery = matchesQuery && (story.chars.indexOf(query.characters) > -1);
            }
            return matchesQuery;
        });
        const sorted = sortBy(filtered, [this.state.sort.by]);
        return (this.state.sort.order === 'ascending') ? sorted : sorted.reverse();
    }

    render() {
        console.log('libary state', this.state);

        const storyEls = this.storiesForQuery().map((story, idx) => {
            // // TODO: change story url to link to reader route
            // const charLabels = story.chars.map((char) => {
            //     return (
            //         <CharacterLabel character={char}
            //                         key={uniqueId()}/>
            //     );
            // });
            //
            // // TODO: trigger hover content
            // const hoverConent = [
            //     <div className="sub-header"> by <a href={story.author_url} target="_blank">{story.author}</a></div>,
            //     <div className="meta">{story.fandoms.join('-')}</div>
            // ];
            //
            // return (
            //     <div className="item" key={idx}>
            //         <div className="content">
            //             <div className="ui grid">
            //                 <div className="six wide column header">
            //                     <a className="hover-anchor" href={story.url}>{story.title}</a>
            //                     <div className="sub-header hover-target"> by <a href={story.author_url} target="_blank">{story.author}</a></div>
            //                     <div className="sub-header hover-target">{story.fandoms.join('-')}</div>
            //                 </div>
            //
            //                 <div className="ten wide right aligned column stats-container">
            //                     <div className="ui basic violet label"><i className="tasks icon"></i>{story.word_cnt}</div>
            //                     <div className="ui basic teal label"><i className="book icon"></i>{story.chapter_cnt}</div>
            //                     <div className="ui basic blue label"><i className="thumbs up icon"></i>{story.fav_cnt}</div>
            //                     <div className="ui basic red label"><i className="heart icon"></i>{story.follow_cnt}</div>
            //                     <div className="ui basic olive label"><i className="comment icon"></i>{story.review_cnt}</div>
            //                 </div>
            //             </div>
            //
            //             <div className="summary">{story.summary}</div>
            //             <div className="extra">
            //                 <div>{ charLabels }</div>
            //             </div>
            //         </div>
            //     </div>
            // );
            return <FicListItem fic={story} key={idx}/>
        });

        return (
            <div className="library-container ui container">
                <div className="center">
                    {/*<Filter updateFilterQuery={(query) => { this.setState({query}); }}*/}
                    {/*options={{fandoms, characters}}*/}
                    {/*currentQuery={this.state.query}*/}
                    {/*/>*/}
                    <Sort updateSort={(sort) => { this.setState({sort}); }}
                          currentSort={this.state.sort}
                    />
                </div>
                <div className="ui items">
                    {storyEls}
                </div>
            </div>
        );
    }
}

export default Library;
