import React, { Fragment } from 'react';
import { PageTitle } from './shared/PageTitle';
import { SearchBar } from './layout/SearchBar';
import { I18n } from '@kineticdata/react';

export const SearchResults = props => {
  const query = props.match.params.query;

  return (
    <Fragment>
      <PageTitle parts={[query, 'Search']} />
      <div className="page-container">
        <div className="page-panel">
          <h1>
            <I18n>Search Results</I18n>
            {query && <small className="ml-2">({query})</small>}
          </h1>
          <section className="mt-3">
            <hr />
            <SearchBar
              inline={true}
              value={query}
              onChange={(value, method) => {
                if (['type', 'escape'].includes(method)) {
                  props.history.replace(`/search/${encodeURIComponent(value)}`);
                }
              }}
            />
          </section>
        </div>
      </div>
    </Fragment>
  );
};
