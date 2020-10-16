import 'font-awesome/css/font-awesome.css';
import 'typeface-open-sans/index.css';
import './assets/styles/master.scss';
import React from 'react';
import { connect } from 'react-redux';
import { matchPath } from 'react-router-dom';
import { push } from 'connected-react-router';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import classNames from 'classnames';
import { Utils } from '@kineticdata/bundle-common';
import { actions } from './redux/modules/app';
import { actions as alertsActions } from './redux/modules/alerts';
import { actions as layoutActions } from './redux/modules/layout';

import { Header as DefaultHeader } from './components/header/Header';
import { AppProvider } from './AppProvider';
// Import available packages
import ServicesApp from '@kineticdata/bundle-services';
import QueueApp from '@kineticdata/bundle-queue';
import TechBarApp from '@kineticdata/bundle-tech-bar';
import DiscussionsApp from '@kineticdata/bundle-discussions';
import SettingsApp from '@kineticdata/bundle-settings';
import SurveyApp from '@kineticdata/bundle-survey';

/**
 * The git repo name to be used for fetching deployed versions of this bundle.
 * Set if this repo is connected to the codefresh pipeline for auto building and
 * publishing the bundle. Otherwise, set to undefined.
 */
const BUNDLE_NAME = 'customer-project-default';

// Mapping of Bundle Package kapp attribute values to App Components
const BUNDLE_PACKAGE_PROVIDERS = {
  services: ServicesApp,
  queue: QueueApp,
  'tech-bar': TechBarApp,
  survey: SurveyApp,
};

// List of available static packages
const STATIC_PACKAGE_PROVIDERS = [SettingsApp, DiscussionsApp];

// Determine the correct AppProvider based on the kapp/route
const getAppProvider = ({ kapp, pathname }) => {
  if (kapp) {
    return (
      BUNDLE_PACKAGE_PROVIDERS[
        Utils.getAttributeValue(kapp, 'Bundle Package', kapp.slug)
      ] || AppProvider
    );
  } else {
    return (
      STATIC_PACKAGE_PROVIDERS.find(provider =>
        matchPath(pathname, { path: provider.location }),
      ) || AppProvider
    );
  }
};

// Default bundle layout
const DefaultLayout = ({ header, sidebar, main, ...props }) => (
  <div className="app-wrapper">
    {header && <div className="app-header">{header}</div>}
    <div
      className={classNames('app-body', {
        'open-sidebar': sidebar && props.sidebarOpen,
        'closed-sidebar': sidebar && !props.sidebarOpen,
      })}
    >
      {sidebar && (
        <aside
          className="app-sidebar-container"
          aria-labelledby="toggle-sidebar"
          aria-hidden={props.sidebarOpen ? 'false' : 'true'}
        >
          {sidebar}
        </aside>
      )}

      <div
        className="app-main-container"
        onClick={
          sidebar && props.sidebarOpen && props.layoutSize === 'small'
            ? props.toggleSidebarOpen
            : undefined
        }
      >
        {main}
      </div>
    </div>
  </div>
);

export const AppComponent = props =>
  !props.loading && (
    <props.AppProvider
      appState={{
        ...props.app.toObject(),
        location: props.appLocation,
        actions: { refreshApp: props.refreshApp },
        layoutSize: props.layoutSize,
        bundleName: BUNDLE_NAME,
      }}
      location={props.location}
      render={({
        components: {
          Layout = DefaultLayout,
          Header = DefaultHeader,
          Sidebar,
          Main,
        } = {},
        header: headerContent,
        sidebar: sidebarContent,
        main: mainContent,
      }) => {
        // Create sidebar content
        const sidebar =
          !props.sidebarHidden && Sidebar ? <Sidebar /> : sidebarContent;
        // Create header content
        const header = !props.headerHidden ? (
          <Header toggleSidebarOpen={sidebar && props.toggleSidebarOpen} />
        ) : (
          headerContent
        );
        // Create main content
        const main = Main ? <Main /> : mainContent;

        // Render the laytou with the content
        return (
          <Layout {...props} header={header} sidebar={sidebar} main={main} />
        );
      }}
    />
  );

export const mapStateToProps = state => ({
  loading: state.app.loading,
  authenticated: state.app.authenticated,
  authRoute: state.app.authRoute,
  kapps: state.app.kapps,
  sidebarOpen: state.layout.sidebarOpen,
  suppressedSidebarOpen: state.layout.suppressedSidebarOpen,
  layoutSize: state.layout.size,
  kappSlug: state.app.kappSlug,
  kapp: state.app.kapp,
  location: state.router.location,
  app: state.app,
});

export const mapDispatchToProps = {
  push,
  loadApp: actions.fetchApp,
  fetchAlertsRequest: alertsActions.fetchAlertsRequest,
  setSidebarOpen: layoutActions.setSidebarOpen,
  setSuppressedSidebarOpen: layoutActions.setSuppressedSidebarOpen,
};

export const App = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withHandlers({
    getLocation: ({ kappSlug }) => app =>
      `${kappSlug !== null ? `/kapps/${kappSlug}` : app.location || '/'}`,
  }),
  withProps(({ authenticated, location, kapp, profile, ...props }) => {
    const AppProvider = getAppProvider({ kapp, pathname: location.pathname });
    const appLocation = props.getLocation(AppProvider);
    const headerHidden = AppProvider
      ? AppProvider.shouldHideHeader &&
        AppProvider.shouldHideHeader({
          appLocation,
          authenticated,
          location,
          kapp,
        })
      : true;
    const sidebarHidden = AppProvider
      ? AppProvider.shouldHideSidebar &&
        AppProvider.shouldHideSidebar({
          appLocation,
          authenticated,
          location,
          kapp,
        })
      : true;
    const shouldSuppressSidebar =
      AppProvider &&
      AppProvider.shouldSuppressSidebar &&
      AppProvider.shouldSuppressSidebar({
        appLocation,
        authenticated,
        location,
        kapp,
      });
    const sidebarOpen = shouldSuppressSidebar
      ? props.suppressedSidebarOpen
      : props.sidebarOpen;
    return {
      AppProvider,
      bodyClassName: AppProvider.bodyClassName || '',
      headerHidden,
      sidebarHidden,
      shouldSuppressSidebar,
      sidebarOpen,
      appLocation,
    };
  }),
  withHandlers({
    toggleSidebarOpen: props =>
      !props.sidebarHidden
        ? () =>
            props.shouldSuppressSidebar
              ? props.setSuppressedSidebarOpen(!props.sidebarOpen)
              : props.setSidebarOpen(!props.sidebarOpen)
        : undefined,
    refreshApp: props => () => props.loadApp(),
  }),
  lifecycle({
    componentDidMount() {
      this.props.authenticated !== null && this.props.loadApp(true);
      if (this.props.bodyClassName) {
        document.body.className = this.props.bodyClassName;
      }
    },
    componentDidUpdate(prevProps) {
      if (this.props.authenticated !== prevProps.authenticated) {
        this.props.loadApp(true);
      }
      if (
        !this.props.loading &&
        !this.props.authenticated &&
        !this.props.AppProvider.hasPublicRoutes
      ) {
        this.props.push(this.props.authRoute);
      }
      if (this.props.bodyClassName !== prevProps.bodyClassName) {
        document.body.className = this.props.bodyClassName;
      }
    },
  }),
)(AppComponent);
