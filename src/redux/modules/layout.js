import { Record } from 'immutable';
// import { LOCATION_CHANGE } from 'connected-react-router';
import { Utils } from '@kineticdata/bundle-common';
const { withPayload } = Utils;
const ns = Utils.namespaceBuilder('app/layout');

export const types = {
  SET_SIZE: ns('SET_SIZE'),
  SET_SIDEBAR_OPEN: ns('SET_SIDEBAR_OPEN'),
};

export const actions = {
  setSize: withPayload(types.SET_SIZE),
  setSidebarOpen: withPayload(types.SET_SIDEBAR_OPEN),
};

export const State = Record({
  size: 'large',
  // Sidebar state: 1 = open, 0 = closing, -1 = closed, null = initial
  sidebarOpen: null,
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.SET_SIZE:
      return state.set('size', payload);
    case types.SET_SIDEBAR_OPEN:
      return state.set('sidebarOpen', payload);
    default:
      return state;
  }
};
