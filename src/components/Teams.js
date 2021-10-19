import React from 'react';
import { compose, lifecycle, withHandlers } from 'recompose';
import { Link, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  openModalForm,
  ErrorNotFound,
  StateListWrapper,
  TeamCard,
  Utils,
} from '@kineticdata/bundle-common';
import { actions } from '../redux/modules/teams';
import { PageTitle } from './shared/PageTitle';
import { Team } from './Team';

export const TeamsNavigation = compose(
  connect(
    null,
    { fetchTeamsRequest: actions.fetchTeamsRequest },
  ),
  lifecycle({
    componentWillMount() {
      this.props.fetchTeamsRequest();
    },
  }),
)(() => (
  <Switch>
    <Route exact path="/teams/:teamSlug" component={Team} />
    <Route exact path="/teams" component={Teams} />
    <Route component={ErrorNotFound} />
  </Switch>
));

const TeamsComponent = ({ error, teams, me, openRequestNewTeam }) => (
  <div className="page-container">
    <div className="page-panel">
      <PageTitle
        parts={['Teams']}
        breadcrumbs={[{ label: 'Home', to: '/' }]}
        title="Teams"
        actions={[
          me.spaceAdmin && {
            label: 'Manage Teams',
            to: '/settings/teams',
          },
          !me.spaceAdmin && {
            label: 'Request New Team',
            onClick: openRequestNewTeam,
          },
        ]}
      />

      <StateListWrapper
        data={teams}
        error={error}
        emptyTitle="There are no teams"
        emptyMessage=""
      >
        {data => (
          <div className="cards">
            {teams.map(team => {
              return (
                <TeamCard key={team.slug} team={team} components={{ Link }} />
              );
            })}
          </div>
        )}
      </StateListWrapper>
    </div>
  </div>
);

const mapStateToProps = state => ({
  me: state.app.profile,
  teams: state.teams.data,
  error: state.teams.error,
  adminKappSlug: Utils.getAttributeValue(
    state.app.space,
    'Admin Kapp Slug',
    'admin',
  ),
});

const openRequestNewTeam = ({ space, adminKappSlug, team }) => config =>
  openModalForm({
    kappSlug: adminKappSlug,
    formSlug: 'new-team-request',
    title: 'Request New Team',
    confirmationMessage: 'Your request has been submitted.',
  });

export const Teams = compose(
  connect(mapStateToProps),
  withHandlers({
    openRequestNewTeam,
  }),
)(TeamsComponent);
