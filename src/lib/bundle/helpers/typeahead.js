import React from 'react';
import ReactDOM from 'react-dom';
import {
  renderIntoDom,
  BridgeTypeahead,
  FormTypeahead,
  StaticTypeahead,
  TeamTypeahead,
  UserTypeahead,
} from '@kineticdata/bundle-common';
import { fromJS, get, has, isImmutable, List } from 'immutable';
import classNames from 'classnames';
import md5 from 'md5';
import { generateComponentsFromRenderers } from './utils';

const toJS = o => (isImmutable(o) ? o.toJS() : o);

// Valid values for type option and their corresponding components
const TYPES = {
  bridge: BridgeTypeahead,
  form: FormTypeahead,
  static: StaticTypeahead,
  team: TeamTypeahead,
  user: UserTypeahead,
};

const initState = ({ value, multiple, renderKey }) => {
  const emptyValue = multiple ? List() : null;
  return { renderKey, emptyValue, value: value ? fromJS(value) : emptyValue };
};

// Wrapper component to manage the value of the typeahead
class TypeaheadWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = initState(props);

    // If an onInit callback is provided, trigger it
    if (typeof props.onInit === 'function') {
      props.onInit();
    }
  }

  // This onChange function will be pass to the Typeahead component. It will
  // update the state and trigger the onChange function provided by the user.
  onChange = value => {
    this.setState({ value });
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(toJS(value));
    }
  };

  // Build a return object to allow the user to interact with this component
  _api = {
    clear: () => !this._unmounted && this.onChange(this.state.emptyValue),
    value: () => (!this._unmounted ? toJS(this.state.value) : undefined),
  };

  // Reset initial state if the render key changes
  componentDidUpdate(prevProps) {
    if (this.props.renderKey !== prevProps.renderKey) {
      this.setState(initState(this.props));
    }
  }

  // Set a flag when the component unmounts so we can prevent the api calls
  // from firing after the component is distroyed.
  componentWillUnmount() {
    this._unmounted = true;
  }

  render() {
    if (this.props.renderKey !== this.state.renderKey) {
      return null;
    }
    const {
      component: Component,
      fieldWrapper = true,
      fieldLabel,
      required = false,
      renderers = {},
      ...props
    } = this.props;

    // Convert renderers into components
    const components = generateComponentsFromRenderers(renderers);

    const component = (
      <Component
        {...props}
        value={this.state.value}
        onChange={this.onChange}
        components={components}
      />
    );

    return !!fieldWrapper ? (
      <div
        className={classNames('form-group', { required })}
        data-element-type="wrapper"
      >
        {fieldLabel && (
          <label
            htmlFor={props.id}
            className="field-label"
            aria-required={!!required}
          >
            {fieldLabel}
          </label>
        )}
        {component}
      </div>
    ) : (
      component
    );
  }
}

// Validates that the container passed into the helper is a dom element
const validateContainer = container =>
  container instanceof HTMLElement
    ? true
    : console.error(
        'Typeahead Error: The container parameter must be a valid dom element.',
      );

// Validates that the options passed into the helper are valid
const validateOptions = options => {
  if (typeof options !== 'object') {
    // Options must be an object
    console.error('Typeahead Error: The options parameter must be an object.');
    return false;
  } else if (!has(TYPES, options.type)) {
    // Type must be valid
    console.error('Typeahead Error: The type option is invalid.');
    return false;
  } else {
    let valid = true;

    // Validate options for BridgeTypeahead
    if (options.type === 'bridge') {
      if (!options.search || typeof options.search !== 'object') {
        console.error(
          "Typeahead Error: The 'search' option must be an object.",
        );
        valid = false;
      } else {
        // kappSlug or datastore flag is required
        if (!options.search.kappSlug && !options.search.datastore) {
          console.error(
            "Typeahead Error: The 'search' option must include either a 'kappSlug' value or a 'datastore' flag.",
          );
          valid = false;
        }
        // formSlug is required
        if (!options.search.formSlug) {
          console.error(
            "Typeahead Error: The 'search' option must include a 'formSlug' value.",
          );
          valid = false;
        }
        // bridgedResourceName is required
        if (!options.search.bridgedResourceName) {
          console.error(
            "Typeahead Error: The 'search' option must include a 'bridgedResourceName' value.",
          );
          valid = false;
        }
      }
    } else if (options.type === 'form') {
      if (!options.search || typeof options.search !== 'object') {
        console.error(
          "Typeahead Error: The 'search' option must be an object.",
        );
        valid = false;
      } else if (!options.search.kappSlug && !options.search.datastore) {
        console.error(
          "Typeahead Error: The 'search' option must include either a 'kappSlug' value or a 'datastore' flag.",
        );
        valid = false;
      }
    } else if (options.type === 'static') {
      if (
        !options.options ||
        !Array.isArray(options.options) ||
        (options.options[0] && typeof options.options[0] !== 'object')
      ) {
        console.error(
          "Typeahead Error: The 'options' option must be an array of objects.",
        );
        valid = false;
      }
    }

    return valid;
  }
};

export const Typeahead = (container, options) => {
  if (validateContainer(container) && validateOptions(options)) {
    // Create a ref so we can have access to the component after it's rendered
    const ref = React.createRef();
    // Create a key that's based on properties that when changed, require the
    // typeahead wrapper component to be reintialized.
    const renderKey = md5(`${options.type}_${options.multiple ? '1' : '0'}`);

    renderIntoDom(
      <TypeaheadWrapper
        {...options}
        component={get(TYPES, options.type)}
        ref={ref}
        renderKey={renderKey}
      />,
      container,
    );

    if (ref.current) {
      return {
        ...(ref.current._api || {}),
        destroy: () => ReactDOM.unmountComponentAtNode(container),
      };
    }
  }
};
