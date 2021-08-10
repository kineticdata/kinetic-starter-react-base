import React from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Navbar,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { connect } from 'react-redux';
import { compose, withHandlers, withState, withProps } from 'recompose';
import { Link } from 'react-router-dom';
import { Utils, selectVisibleKapps } from '@kineticdata/bundle-common';
import { AlertsDropdown } from './AlertsDropdown';
import { ProfileDropdown } from './ProfileDropdown';
import { I18n } from '@kineticdata/react';
import * as selectors from '../../redux/selectors';

const BuildKappLink = ({ kapp, onClick, nameOverride = kapp.name }) => (
  <Link
    className="dropdown-item"
    to={`/kapps/${kapp.slug}`}
    onClick={onClick}
    role="menuitem"
  >
    <span
      className={`fa fa-fw' ${Utils.getAttributeValue(kapp, 'Icon') ||
        'fa-book'}`}
    />
    <I18n>{nameOverride}</I18n>
  </Link>
);

export const HeaderComponent = ({
  toggleSidebarOpen,
  authenticated,
  authRoute,
  hasAccessToManagement,
  hasAccessToSupport,
  menuLabel,
  kapp,
  visibleKapps,
  spaceMenuLinks,
  mainNavDropdownOpen,
  mainNavDropdownToggle,
}) => (
  <Navbar color="faded" light>
    <Nav navbar>
      {typeof toggleSidebarOpen === 'function' &&
        authenticated && (
          <NavItem className="nav-item--border-right">
            <NavLink
              tag="button"
              role="button"
              onClick={toggleSidebarOpen}
              id="toggle-sidebar"
              aria-label="Toggle Sidebar"
            >
              <i className="fa fa-fw fa-bars" aria-hidden="true" />
            </NavLink>
          </NavItem>
        )}
      <NavItem className="nav-item--border-right mr-auto">
        {authenticated ? (
          <Dropdown
            className="main-nav-dropdown"
            isOpen={mainNavDropdownOpen}
            toggle={mainNavDropdownToggle}
          >
            <DropdownToggle nav role="button">
              <span>
                <I18n>{menuLabel}</I18n>
              </span>{' '}
              <i className="fa fa-caret-down" />
            </DropdownToggle>
            <DropdownMenu>
              {/* ALL KAPPS LINKS */}
              <DropdownItem header>Kapps</DropdownItem>
              {visibleKapps.map(thisKapp => (
                <BuildKappLink
                  kapp={thisKapp}
                  key={thisKapp.slug}
                  onClick={mainNavDropdownToggle}
                />
              ))}

              {/* SPACE LEVEL LINKS */}
              <DropdownItem header>Space</DropdownItem>
              {spaceMenuLinks.map(
                link =>
                  link.relative ? (
                    <Link
                      key={link.label}
                      className="dropdown-item"
                      to={link.path}
                      onClick={mainNavDropdownToggle}
                      role="menuitem"
                    >
                      <span className={`fa fa-fw ${link.icon}`} />
                      <I18n>{link.label}</I18n>
                    </Link>
                  ) : (
                    <a
                      key={link.label}
                      className="dropdown-item"
                      href={link.path}
                      onClick={mainNavDropdownToggle}
                      target="_blank"
                      rel="noopener noreferrer"
                      role="menuitem"
                    >
                      <span className={`fa fa-fw ${link.icon}`} />
                      <I18n>{link.label}</I18n>
                    </a>
                  ),
              )}
              <Link
                className="dropdown-item"
                to="/discussions"
                onClick={mainNavDropdownToggle}
                role="menuitem"
              >
                <span className="fa fa-fw fa-comments" />
                <I18n>Discussions</I18n>
              </Link>
              <Link
                className="dropdown-item"
                to="/teams"
                onClick={mainNavDropdownToggle}
                role="menuitem"
              >
                <span className="fa fa-fw fa-users" />
                <I18n>Teams</I18n>
              </Link>
              <Link
                className="dropdown-item"
                to="/settings"
                onClick={mainNavDropdownToggle}
                role="menuitem"
              >
                <span className="fa fa-fw fa-cogs" />
                <I18n>Settings</I18n>
              </Link>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <div id="header-kapp-dropdown">
            <span className="nav-link nav-link--static">
              <I18n>{menuLabel}</I18n>
            </span>
          </div>
        )}
      </NavItem>
      {authenticated && <AlertsDropdown />}
      {authenticated ? (
        <ProfileDropdown />
      ) : (
        <NavItem>
          <Link className="nav-link" to={authRoute} title="Sign In">
            <i className="fa fa-fw fa-sign-in" />
          </Link>
        </NavItem>
      )}
    </Nav>
  </Navbar>
);

export const mapStateToProps = state => ({
  loading: state.app.loading,
  kapp: state.app.kapp,
  authenticated: state.app.authenticated,
  authRoute: state.app.authRoute,
  pathname: state.router.location.pathname,
  // Selectors
  visibleKapps: selectVisibleKapps(state),
  hasAccessToManagement: selectors.selectHasAccessToManagement(state),
  hasAccessToSupport: selectors.selectHasAccessToSupport(state),
  spaceMenuLinks: selectors.selectMenuLinks(state.app.space),
});

export const Header = compose(
  connect(mapStateToProps),
  withState('mainNavDropdownOpen', 'setMainNavDropdownOpen', false),
  withProps(({ kapp, pathname, label }) => ({
    menuLabel:
      label ||
      (kapp
        ? kapp.name || kapp.slug
        : pathname.replace(/^\/([^/]*).*/, '$1').replace('-', ' ') || 'Home'),
  })),
  withHandlers({
    mainNavDropdownToggle: props => () =>
      props.setMainNavDropdownOpen(open => !open),
  }),
)(HeaderComponent);
