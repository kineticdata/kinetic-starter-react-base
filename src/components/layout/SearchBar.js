import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Autosuggest from 'react-autosuggest';
import {
  fetchSubmission,
  searchSubmissions,
  fetchForms,
  I18n,
  defineKqlQuery,
} from '@kineticdata/react';
import {
  selectServicesKapp,
  selectQueueKapp,
} from '@kineticdata/bundle-common';
import { Modal } from 'reactstrap';
import classNames from 'classnames';
import { debounce } from 'lodash-es';

const GUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const HANDLE_PATTERN = /^[0-9a-f]{6}$/i;

// Max number of suggestions to show
const PAGE_SIZE = 25;
const INLINE_PAGE_SIZE = 100;
// Minimum number of characters that must be typed to allow a search to execute
const MIN_SEARCH_LENGTH = 2;
// Static parameters for servicesform search
const SERVICES_FORM_TYPES = ['Service'];
const SERVICES_FORM_STATUSES = ['New', 'Active'];
const SERVICES_FORM_FIELDS = ['name', 'description', 'attributes[Keyword]'];

const SUGGESTION_MAPPERS = {
  form: form => ({
    id: form.slug,
    label: form.name,
    path: `/kapps/${form.kapp.slug}/forms/${form.slug}`,
    data: form,
    type: 'form',
  }),
  submission: submission => ({
    id: submission.id,
    label: submission.label,
    path: `/kapps/${submission.form.kapp.slug}/submissions/${submission.id}`,
    data: submission,
    type: 'submission',
  }),
};

const SUGGESTION_RENDERERS = {
  form: ({ data }) => (
    <div className="d-flex">
      <div className="icon align-self-center">
        <span className="fa fa-file-o fa-fw" />
      </div>
      <div className="flex-grow-1">
        <div className="small">{data.kapp.name}</div>
        <div className="large">{data.name}</div>
      </div>
    </div>
  ),
  submission: ({ data }) => (
    <div className="d-flex">
      <div className="align-self-center">
        <span className="fa fa-file-text-o fa-fw" />
      </div>
      <div className="flex-grow-1">
        {data.form && (
          <div className="small">
            {data.form.kapp.name} > {data.form.name}
          </div>
        )}
        <div className="large">{data.label}</div>
      </div>
    </div>
  ),
};

// Helper function for building user search q parameter
const buildFormQuery = value => {
  const searcher = defineKqlQuery();
  // Add static query parts
  searcher.in('type', 'types').in('status', 'statuses');
  // Add value query parts
  searcher.or();
  SERVICES_FORM_FIELDS.forEach(field => searcher.matches(field, 'value'));
  searcher.end();
  return searcher.end()({
    statuses: SERVICES_FORM_STATUSES,
    types: SERVICES_FORM_TYPES,
    value,
  });
};

class SearchBarComponent extends React.Component {
  constructor(props) {
    console.log('INIT SEARCH BAR');
    super(props);
    this.state = {
      // Current value
      value: props.value || '',
      // Current results/suggestions
      suggestions: [],
      // Should the search bar be visible
      open: !!props.inline,
      // Is the search bar animating to open or close
      animating: false,
      // Should the suggestions/status be visible
      active: !!props.inline,
      // Is query executing
      loading: false,
      // Did query error
      error: null,
      // Did query return too many results
      more: false,
      // Did query return no results
      empty: false,
      // Is the enterd value too short
      short: !props.value || props.value.length < MIN_SEARCH_LENGTH,
    };
    this.inline = props.inline;
    this.pageSize = props.inline ? INLINE_PAGE_SIZE : PAGE_SIZE;
    this.autosuggestRef = React.createRef();
  }

  componentDidMount() {
    if (this.state.value && !this.state.short) {
      this.setState({ loading: true });
      this.search(this.state.value, this.onSuggestionsFetchCompleted);
    }
  }

  /**
   * Returns an array of dataSources that should be search for the given value
   * Each dataSource is an object with the following properties:
   *   fn: API function to call
   *   params: Parameter object to pass to the API function
   *   transform: Function that transforms the API results into the expected
   *       suggestion format
   *   then: Optional function to call after the query completes
   */
  generateDataSources = value => {
    // Check if value matches a handle or guid
    const isHandle = HANDLE_PATTERN.test(value);
    const isGuid = GUID_PATTERN.test(value);

    return [
      // Search for services forms if value doesn't match a guid
      !isGuid &&
        !!this.props.servicesKapp && {
          fn: fetchForms,
          params: {
            kappSlug: this.props.servicesKapp.slug,
            q: buildFormQuery(value),
            limit: this.pageSize,
            include: 'details,categorizations,attributesMap,kapp',
          },
          transform: ({ forms, error, nextPageToken }) => ({
            suggestions: forms ? forms.map(SUGGESTION_MAPPERS.form) : [],
            error,
            more: !!nextPageToken,
          }),
        },
      // Search for specific submission if value is a guid
      isGuid && {
        fn: fetchSubmission,
        params: { id: value, include: ['details', 'form', 'form.kapp'] },
        transform: ({ submission, error }) => ({
          suggestions: submission
            ? [SUGGESTION_MAPPERS.submission(submission)]
            : [],
          error: error && error.statusCode === 404 ? null : error,
          more: false,
        }),
      },
      // Search for services submissions if value is a handle
      isHandle &&
        !!this.props.servicesKapp && {
          fn: searchSubmissions,
          params: {
            search: {
              q: `handle = "${value}"`,
              include: ['details', 'form', 'form.kapp'],
            },
            kapp: this.props.servicesKapp.slug,
            limit: this.pageSize,
          },
          transform: ({ submissions, error, nextPageToken }) => ({
            suggestions: submissions
              ? submissions.map(SUGGESTION_MAPPERS.submission)
              : [],
            error,
            more: !!nextPageToken,
          }),
        },
      // Search for services submissions if value is a handle
      isHandle &&
        !!this.props.queueKapp && {
          fn: searchSubmissions,
          params: {
            search: {
              q: `handle = "${value}"`,
              include: ['details', 'form', 'form.kapp'],
            },
            kapp: this.props.queueKapp.slug,
            limit: this.pageSize,
          },
          transform: ({ submissions, error, nextPageToken }) => ({
            suggestions: submissions
              ? submissions.map(SUGGESTION_MAPPERS.submission)
              : [],
            error,
            more: !!nextPageToken,
          }),
        },
    ].filter(Boolean);
  };

  completeAnimation = () => {
    if (this.state.open && this.autosuggestRef.current) {
      this.autosuggestRef.current.input.focus();
    }
    this.setState({ animating: false });
  };

  toggle = debounce(open => {
    if ((open && !this.state.open) || (!open && this.state.open)) {
      this.setState({ open, animating: true, value: '' });
      window.setTimeout(this.completeAnimation, 300);
    }
  }, 200);

  toggleOpen = () => {
    this.toggle(true);
  };

  toggleClose = () => {
    this.toggle(false);
  };

  focusInput = () => {
    if (this.state.open && this.autosuggestRef.current) {
      this.autosuggestRef.current.input.focus();
    }
  };

  onBtnFocus = () => {
    if (this.state.open) {
      this.toggleOpen();
    }
  };

  onBtnBlur = () => {
    this.toggleClose();
  };

  // Set state value on change
  onChange = (event, { newValue, method }) => {
    this.setState({ value: newValue });
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(newValue, method);
    }
  };

  // Open suggestions container on focus
  onFocus = () => {
    console.log('onFocus', { ...this.state });
    if (!this.props.modal && !this.inline) {
      this.setState({ active: true });
      this.toggleOpen();
    }
  };

  // Close suggestions container on blur
  onBlur = () => {
    console.log('onBlur', { ...this.state });
    if (!this.props.modal && !this.inline) {
      this.setState({ active: false });
      this.toggleClose();
    }
  };

  // Initiate search on press of Enter key if query is valid
  onKeyDown = event => {
    if (event.keyCode === 13) {
      console.log(
        'onKeyDown',
        { ...this.state },
        event.keyCode,
        this.state.active,
      );
      if (!this.state.short) {
        this.goToAllResults();
      }
    }
  };

  // When a suggestion is selected, close suggestions container and take
  // appropriate action based on type of suggestion
  onSuggestionSelected = (event, { suggestion }) => {
    console.log('onSuggestionSelected', suggestion);
    if (suggestion) {
      this.navigate(suggestion.path);
      if (this.autosuggestRef.current) {
        this.autosuggestRef.current.input.blur();
      }
    }
  };

  navigate = debounce(
    (...args) => {
      this.props.push(...args);
    },
    200,
    { leading: true, trailing: false },
  );

  goToAllResults = () => {
    this.navigate(`/search/${this.state.value}`);
  };

  // Fetches the data to show as suggestions.
  retrieveSuggestions = (value, callback) => {
    const dataSources = this.generateDataSources(value);
    // Fetch both forms and business applications
    Promise.all(dataSources.map(ds => ds.fn(ds.params))).then(rawResults => {
      // Call any then functions from the dataSources
      rawResults.forEach((r, i) => {
        if (typeof dataSources[i].then === 'function') {
          dataSources[i].then(r);
        }
      });
      // Transform each result
      const results = rawResults.map((r, i) => dataSources[i].transform(r));
      // Merge all suggestions together
      const suggestions = results
        .flatMap(r => r.suggestions || [])
        .sort((a, b) => (a.label > b.label ? 1 : a.label < b.label ? -1 : 0))
        .slice(0, this.pageSize);
      // Call the callback function with the data
      callback({
        suggestions,
        error: results.map(r => r.error).filter(Boolean)[0],
        more: results.some(r => r.more) || suggestions.length > this.pageSize,
      });
    });
  };

  search = debounce((...args) => {
    this.retrieveSuggestions(...args);
  }, 150);

  // When the value changes, validate the query and reset state. This will hide
  // suggestions and re-show the help text if a user modifies their query.
  onSuggestionsFetchRequested = ({ value, reason }) => {
    console.log('onSuggestionsFetchRequested', value, this.state.value, reason);

    if (reason !== 'input-focused' || (!this.props.modal && !this.inline)) {
      const short = value.length < MIN_SEARCH_LENGTH;
      this.setState({
        suggestions: [],
        loading: !short,
        error: null,
        more: false,
        empty: false,
        short,
      });
      if (!short) {
        this.search(value, this.onSuggestionsFetchCompleted);
      }
    }
  };

  // When a query is completed, update state with the suggestions and statuses
  onSuggestionsFetchCompleted = ({ suggestions = [], error, more }) => {
    // console.log('onSuggestionsFetchCompleted', { ...this.state }, suggestions);
    this.setState({
      suggestions,
      loading: false,
      error,
      more,
      empty: suggestions && suggestions.length === 0,
    });
  };

  // When the search bar is blurred or a suggestion is selected, reset state
  onSuggestionsClearRequested = (...args) => {
    console.log('onSuggestionsClearRequested', args);
    if (!this.props.modal && !this.inline) {
      this.setState({
        suggestions: [],
        loading: false,
        error: null,
        more: false,
        empty: false,
        short: true,
      });
    }
  };

  // Renders a single suggestion
  renderSuggestion = (suggestion, { isHighlighted }) => {
    const Component = SUGGESTION_RENDERERS[suggestion.type];
    return (
      <div
        className={classNames('suggestion', {
          active: isHighlighted,
        })}
      >
        {Component && <Component data={suggestion.data} />}
      </div>
    );
  };

  // Renders the suggestions wrapper and any status/error messages
  renderSuggestionsContainer = ({ containerProps, children }) =>
    (this.props.modal ||
      this.inline ||
      (!this.state.animating && this.state.active)) && (
      <div
        {...containerProps}
        className={classNames('suggestions', {
          open: this.state.open,
          inline: this.props.inline,
        })}
      >
        {this.state.loading ? (
          <div className="status info">
            <I18n>Searching...</I18n>
          </div>
        ) : this.state.short ? (
          <div className="status info">
            <I18n
              render={translate =>
                translate(
                  `Enter at least %d character${
                    MIN_SEARCH_LENGTH !== 1 ? 's' : ''
                  } to search for forms, or enter a handle to find your requests.`,
                ).replace('%d', MIN_SEARCH_LENGTH)
              }
            />
          </div>
        ) : this.state.error ? (
          <div className="status warning">
            <I18n>There was an error fetching results.</I18n>
          </div>
        ) : this.state.empty ? (
          <div className="status warning">
            <I18n>No matching results</I18n>
          </div>
        ) : this.state.more ? (
          <div className="status warning">
            <I18n
              render={translate =>
                translate(
                  'Too many results, first %d shown. Please refine your search.',
                ).replace('%d', this.pageSize)
              }
            />
          </div>
        ) : null}
        {children}
      </div>
    );

  renderInputComponent = inputProps => <input {...inputProps} />;

  render() {
    const { open, animating, value, suggestions } = this.state;

    const autosuggest = (
      <I18n
        render={translate => (
          <Autosuggest
            getSuggestionValue={suggestion =>
              suggestion ? suggestion.label : ''
            }
            inputProps={{
              value: value,
              onChange: this.onChange,
              onBlur: this.onBlur,
              onFocus: this.onFocus,
              onKeyDown: this.onKeyDown,
              placeholder: translate(''),
              autoFocus: this.props.autoFocus,
            }}
            onSuggestionHighlighted={this.onHighlight}
            onSuggestionSelected={this.onSuggestionSelected}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            renderSuggestion={this.renderSuggestion}
            renderSuggestionsContainer={this.renderSuggestionsContainer}
            renderInputComponent={this.renderInputComponent}
            alwaysRenderSuggestions={this.props.modal || this.inline}
            suggestions={suggestions}
            ref={this.autosuggestRef}
          />
        )}
      />
    );

    return this.inline ? (
      <div className="app-search--inline">
        <div className="kinetic-typeahead">
          <button className="search" onClick={this.focusInput}>
            <span className="fa fa-search" />
          </button>
          {autosuggest}
        </div>
      </div>
    ) : this.props.modal ? (
      <>
        <button className="search" onClick={this.toggleOpen}>
          <span className="fa fa-search" />
        </button>
        <Modal
          className="app-search--modal"
          size="lg"
          isOpen={this.state.open}
          toggle={this.toggleClose}
        >
          <div className="kinetic-typeahead">
            <button className="search" onClick={this.focusInput}>
              <span className="fa fa-search" />
            </button>
            {autosuggest}
            <button
              className="goto-search"
              onClick={this.goToAllResults}
              disabled={!value}
            >
              <span className="fa fa-arrow-right" />
            </button>
            <span className="divider" />
            <button className="close-search" onClick={this.toggleClose}>
              <span className="fa fa-times" />
            </button>
          </div>
        </Modal>
      </>
    ) : (
      <div
        className={classNames('kinetic-typeahead', this.props.className, {
          open,
          animating,
        })}
      >
        <button
          className="search"
          onClick={!open ? this.toggleOpen : this.focusInput}
          onFocus={this.onBtnFocus}
          onBlur={this.onBtnBlur}
          disabled={animating}
        >
          <span className="fa fa-search" />
        </button>
        {(open || animating) && autosuggest}
        <button
          className="goto-search"
          onClick={this.goToAllResults}
          onFocus={this.onBtnFocus}
          onBlur={this.onBtnBlur}
          disabled={!value || !open || animating}
        >
          <span className="fa fa-arrow-right" />
        </button>
      </div>
    );
  }
}

export const SearchBar = connect(
  state => ({
    servicesKapp: selectServicesKapp(state),
    queueKapp: selectQueueKapp(state),
  }),
  { push },
)(SearchBarComponent);
