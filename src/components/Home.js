import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withHandlers, withState } from 'recompose';
import { Link } from 'react-router-dom';
import { PageTitle } from './shared/PageTitle';
import {
  addToast,
  selectQueueKapp,
  selectServicesKapp,
  selectSurveyKapp,
  selectTechBarKapp,
} from '@kineticdata/bundle-common';
import { I18n } from '@kineticdata/react';

export const HomeComponent = ({
  space,
  kapp,
  forms,
  visibleKapps,
  profile,
  pathname,
}) => (
  <div className="page-container">
    <div className="page-panel">
      <PageTitle />
      <div class="page-title-heading">
        <div className="page-title__content">
          <h1>Welcome!</h1>
        </div>
      </div>{' '}
    </div>
  </div>
);

export const mapStateToProps = state => {
  return {
    space: state.app.space,
    kapps: state.app.kapps,
    queueKapp: selectQueueKapp(state),
    servicesKapp: selectServicesKapp(state),
    surveyKapp: selectSurveyKapp(state),
    techBarKapp: selectTechBarKapp(state),
    profile: state.app.profile,
    pathname: state.router.location.pathname,
  };
};

export const Home = compose(
  connect(mapStateToProps),
  withHandlers({}),
  lifecycle({
    componentDidMount() {},
    componentDidUpdate(prevProps) {},
  }),
)(HomeComponent);
