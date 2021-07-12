import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  selectQueueKapp,
  selectServicesKapp,
  selectSurveyKapp,
  selectTechBarKapp,
} from '@kineticdata/bundle-common';
import classNames from 'classnames';

const SidebarComponent = props => (
  <>
    <div className="app-sidebar__group app-sidebar__group--toggle">
      <button className="toggle" onClick={props.toggleSidebar}>
        <span
          className={classNames('fa', {
            'fa-bars': !props.mobile,
            'fa-chevron-left': props.mobile,
          })}
        />
      </button>
    </div>
    <div className="app-sidebar__group">
      <Link to="/">
        <span className="fa fa-home" />
        <span className="title">Home</span>
      </Link>
      {props.servicesKapp && (
        <Link to={`/kapps/${props.servicesKapp.slug}/categories`}>
          <span className="fa fa-files-o" />
          <span className="title">Service Catalog</span>
        </Link>
      )}
      {props.techBarKapp && (
        <Link to={`/kapps/${props.techBarKapp.slug}`}>
          <span className="fa fa-clock-o" />
          <span className="title">Tech Bar</span>
        </Link>
      )}
      {props.surveyKapp && (
        <Link to={`/kapps/${props.surveyKapp.slug}`}>
          <span className="fa fa-clipboard" />
          <span className="title">Survey</span>
        </Link>
      )}
      <Link to="/discussions">
        <span className="fa fa-comments-o" />
        <span className="title">Discussions</span>
      </Link>
      <Link to="/teams">
        <span className="fa fa-users" />
        <span className="title">Teams</span>
      </Link>
    </div>
    <div className="app-sidebar__group--divider" />
    <div className="app-sidebar__group">
      {props.servicesKapp && (
        <Link to={`/kapps/${props.servicesKapp.slug}/requests`}>
          <span className="fa fa-file-text-o" />
          <span className="title">My Requests</span>
        </Link>
      )}
      {props.queueKapp && (
        <Link to={`/kapps/${props.queueKapp.slug}`}>
          <span className="fa fa-tasks" />
          <span className="title">My Actions</span>
        </Link>
      )}
      {props.surveyKapp && (
        <Link to={`/kapps/${props.surveyKapp.slug}`}>
          <span className="fa fa-pencil-square-o" />
          <span className="title">My Surveys</span>
        </Link>
      )}
    </div>
    <div className="app-sidebar__group app-sidebar__group--static mt-auto">
      <Link to="/settings">
        <span className="fa fa-cog" />
        <span className="title">Settings</span>
      </Link>
    </div>
  </>
);

export const Sidebar = connect(state => ({
  space: state.app.space,
  kapps: state.app.kapps,
  queueKapp: selectQueueKapp(state),
  servicesKapp: selectServicesKapp(state),
  surveyKapp: selectSurveyKapp(state),
  techBarKapp: selectTechBarKapp(state),
}))(SidebarComponent);
