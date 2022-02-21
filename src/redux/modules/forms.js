import { Map } from 'immutable';
import { Utils } from '@kineticdata/bundle-common';
const { withPayload } = Utils;
const ns = Utils.namespaceBuilder('app/forms');

export const types = {
  FETCH_FORM_REQUEST: ns('FETCH_FORM_REQUEST'),
  FETCH_FORM_SUCCESS: ns('FETCH_FORM_SUCCESS'),
  FETCH_FORM_FAILURE: ns('FETCH_FORM_FAILURE'),
};

export const actions = {
  fetchFormRequest: withPayload(types.FETCH_FORM_REQUEST),
  fetchFormSuccess: withPayload(types.FETCH_FORM_SUCCESS),
  fetchFormFailure: withPayload(types.FETCH_FORM_FAILURE),
};

export const reducer = (state = Map(), { type, payload }) => {
  switch (type) {
    case types.FETCH_FORM_REQUEST:
      return payload.kappSlug && payload.formSlug
        ? (!state.has(payload.kappSlug)
            ? state.set(payload.kappSlug, Map())
            : state
          ).setIn([payload.kappSlug, payload.formSlug], null)
        : state;
    case types.FETCH_FORM_SUCCESS:
      return state.setIn([payload.kappSlug, payload.formSlug], payload.form);
    case types.FETCH_FORM_FAILURE:
      return state.deleteIn([payload.kappSlug, payload.formSlug]);
    default:
      return state;
  }
};
