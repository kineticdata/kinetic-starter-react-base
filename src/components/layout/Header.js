import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ProfileDropdown } from './ProfileDropdown';
import { SearchBar } from './SearchBar';
import { Utils } from '@kineticdata/bundle-common';

import logo from '../../assets/images/login-name.png';

const HeaderComponent = props => (
  <>
    {props.mobile && (
      <button className="toggle" onClick={props.toggleSidebar}>
        <span className="fa fa-bars" />
      </button>
    )}
    {props.logo &&
      props.logo !== 'Disabled' && (
        <Link className="logo" to="/">
          <img src={props.logo} alt="Logo" />
        </Link>
      )}

    <div className="mr-auto" aria-hidden="true" />

    <SearchBar modal={props.mobile} />
    {props.authenticated && <ProfileDropdown />}
    {!props.authenticated && (
      <Link className="nav-link" to={props.authRoute} title="Sign In">
        <i className="fa fa-fw fa-sign-in" />
      </Link>
    )}
  </>
);

export const Header = connect(state => ({
  authenticated: state.app.authenticated,
  authRoute: state.app.authRoute,
  logo: Utils.getAttributeValue(state.app.space, 'Logo', logo),
}))(HeaderComponent);
