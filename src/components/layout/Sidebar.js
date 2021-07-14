import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { matchPath } from 'react-router';
import { Link } from 'react-router-dom';
import {
  selectQueueKapp,
  selectServicesKapp,
  selectSurveyKapp,
  selectTechBarKapp,
  Utils,
} from '@kineticdata/bundle-common';
import { I18n } from '@kineticdata/react';
import classNames from 'classnames';

const SidebarComponent = props => {
  const SidebarLink = useCallback(
    ({ to, matchParams = {}, icon, children }) => (
      <Link
        to={to}
        className={classNames({
          active: matchPath(props.pathname, { path: to, ...matchParams }),
        })}
        onClick={props.onSidebarAction}
      >
        <span className={icon} />
        <span className="title">{children}</span>
      </Link>
    ),
    [props.pathname, props.onSidebarAction],
  );

  return (
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
        <SidebarLink to="/" icon="fa fa-home" matchParams={{ exact: true }}>
          <I18n>Home</I18n>
        </SidebarLink>
        {Utils.isKappVisible(props.servicesKapp) && (
          <SidebarLink
            to={`/kapps/${props.servicesKapp.slug}/categories`}
            icon="fa fa-files-o"
          >
            <I18n>Service Catalog</I18n>
          </SidebarLink>
        )}

        {Utils.isKappVisible(props.queueKapp) && (
          <SidebarLink to={`/kapps/${props.queueKapp.slug}`} icon="fa fa-tasks">
            <I18n>Queue</I18n>
          </SidebarLink>
        )}
        {Utils.isKappVisible(props.techBarKapp) && (
          <SidebarLink
            to={`/kapps/${props.techBarKapp.slug}`}
            icon="fa fa-clock-o"
          >
            <I18n>Tech Bar</I18n>
          </SidebarLink>
        )}
        {Utils.isKappVisible(props.surveyKapp) && (
          <SidebarLink
            to={`/kapps/${props.surveyKapp.slug}/admin`}
            icon="fa fa-clipboard"
          >
            <I18n>Survey</I18n>
          </SidebarLink>
        )}
      </div>
      <div className="app-sidebar__group--divider" />
      <div className="app-sidebar__group">
        {Utils.isKappVisible(props.servicesKapp) && (
          <SidebarLink
            to={`/kapps/${props.servicesKapp.slug}/requests`}
            icon="fa fa-file-text-o"
          >
            <I18n>My Requests</I18n>
          </SidebarLink>
        )}
        {props.surveyKapp && (
          <SidebarLink
            to={`/kapps/${props.surveyKapp.slug}`}
            icon="fa fa-pencil-square-o"
          >
            <I18n>My Surveys</I18n>
          </SidebarLink>
        )}
        <SidebarLink to="/discussions" icon="fa fa-comments-o">
          <I18n>My Discussions</I18n>
        </SidebarLink>
      </div>
      <div className="app-sidebar__group app-sidebar__group--static mt-auto">
        <Link to="/settings">
          <span className="fa fa-cog" />
          <span className="title">Settings</span>
        </Link>
      </div>
    </>
  );
};

export const Sidebar = connect(state => ({
  space: state.app.space,
  kapps: state.app.kapps,
  queueKapp: selectQueueKapp(state),
  servicesKapp: selectServicesKapp(state),
  surveyKapp: selectSurveyKapp(state),
  techBarKapp: selectTechBarKapp(state),
  pathname: state.router.location.pathname,
}))(SidebarComponent);
