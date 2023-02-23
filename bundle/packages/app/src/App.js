// import '@fortawesome/fontawesome-free/css/all.css';
// import '@fortawesome/fontawesome-free/css/v4-shims.css';
import 'font-awesome/css/font-awesome.css';
import 'typeface-open-sans/index.css';
import './assets/styles/master.scss';
import React from 'react';
import { connect } from 'react-redux';
import { matchPath } from 'react-router-dom';
import { push } from 'connected-react-router';
import { compose, lifecycle, withHandlers, withProps } from 'recompose';
import { Utils } from '@kineticdata/bundle-common';
import { actions } from './redux/modules/app';
import { actions as alertsActions } from './redux/modules/alerts';

import LayoutRenderer from './components/layout';
import { AppProvider } from './AppProvider';
// Import available packages
import ServicesApp from '@kineticdata/bundle-services';
import QueueApp from '@kineticdata/bundle-queue';
import TechBarApp from '@kineticdata/bundle-tech-bar';
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
const STATIC_PACKAGE_PROVIDERS = [SettingsApp];

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

export const AppComponent = props =>
  !props.loading && (
    <props.AppProvider
      appState={{
        ...props.app.toObject(),
        location: props.appLocation,
        actions: {
          refreshApp: props.refreshApp,
          refreshProfile: props.refreshProfile,
        },
        layoutSize: props.layoutSize,
        bundleName: BUNDLE_NAME,
      }}
      location={props.location}
      render={appProps => (
        <LayoutRenderer
          mobile={props.layoutSize === 'small'}
          shouldHideHeader={props.shouldHideHeader}
          shouldHideSidebar={props.shouldHideSidebar}
          shouldSuppressSidebar={props.shouldSuppressSidebar}
          {...appProps}
        />
      )}
    />
  );

export const mapStateToProps = state => ({
  loading: state.app.loading,
  authenticated: state.app.authenticated,
  authRoute: state.app.authRoute,
  kapps: state.app.kapps,
  layoutSize: state.layout.size,
  kappSlug: state.app.kappSlug,
  kapp: state.app.kapp,
  location: state.router.location,
  app: state.app,
});

export const mapDispatchToProps = {
  push,
  loadApp: actions.fetchApp,
  loadProfile: actions.fetchProfileRequest,
  fetchAlertsRequest: alertsActions.fetchAlertsRequest,
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
    const shouldHideHeader = AppProvider
      ? AppProvider.shouldHideHeader &&
        !!AppProvider.shouldHideHeader({
          appLocation,
          authenticated,
          location,
          kapp,
        })
      : true;
    const shouldHideSidebar = AppProvider
      ? AppProvider.shouldHideSidebar &&
        !!AppProvider.shouldHideSidebar({
          appLocation,
          authenticated,
          location,
          kapp,
        })
      : true;
    const shouldSuppressSidebar =
      AppProvider &&
      AppProvider.shouldSuppressSidebar &&
      !!AppProvider.shouldSuppressSidebar({
        appLocation,
        authenticated,
        location,
        kapp,
      });
    return {
      AppProvider,
      bodyClassName: AppProvider.bodyClassName || '',
      shouldHideHeader,
      shouldHideSidebar,
      shouldSuppressSidebar,
      appLocation,
    };
  }),
  withHandlers({
    refreshApp: props => () => props.loadApp(),
    refreshProfile: props => () => props.loadProfile(),
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
