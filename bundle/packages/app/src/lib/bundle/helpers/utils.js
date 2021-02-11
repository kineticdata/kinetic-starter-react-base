import React from 'react';
import { Map } from 'immutable';

/**
 * Builds React elements based on a JSON configuration.
 *
 * @param config    {
 *   tag        string  HTML tag to render. Defaults to Fragment.
 *   props      object  Object of props to pass to the element.
 *   children   string|object|array   Content to render inside element.
 *                Recursively calls buildRenderer() on each child.
 * }
 *
 * The parameter may be an array of config objects, in which case they will be
 * rendered inside a fragment.
 */
export const evaluateRenderer = config => {
  // If config is an array, render a fragment with all array items as children.
  if (Array.isArray(config)) {
    return React.createElement(
      React.Fragment,
      null,
      ...config.filter(Boolean).map(evaluateRenderer),
    );
  }
  // If config is an object, render the element using tag and props properties.
  else if (typeof config === 'object' && config !== null) {
    const { tag, props, children } = config;
    return React.createElement(
      // Default tag to a Fragment if not provided
      tag || React.Fragment,
      // Pass props only if a tag is provided
      tag ? props : null,
      // Recursively call this function for all children.
      ...(children
        ? Array.isArray(children)
          ? children
          : [children]
        : []
      ).map(evaluateRenderer),
    );
  }
  // Otherwise return the config to allow for justa  string value to be passed.
  else {
    return config;
  }
};

/**
 * Converts a map of renderers to components using the evaluateRenderer
 * function. A renderer must be an object, or a function that returns an object,
 * with the the structure `{ tag: '', props: {}, children: [] }` where children
 * is an array of objects of the same structure.
 */
export const generateComponentsFromRenderers = (renderers = {}) =>
  Map(renderers)
    .map(
      renderer =>
        typeof renderer === 'function'
          ? props => evaluateRenderer(renderer(props))
          : typeof renderer === 'object'
            ? evaluateRenderer(renderer)
            : null,
    )
    .filter(Boolean)
    .toJS();
