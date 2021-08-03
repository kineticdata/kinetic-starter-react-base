import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import { Link } from 'react-router-dom';
import {
  openModalForm,
  Card,
  CardCol,
  CardRow,
  AvatarList,
  DiscussionsPanel,
  ErrorMessage,
  LoadingMessage,
  TeamCard,
  Utils,
  selectDiscussionsEnabled,
} from '@kineticdata/bundle-common';
import { PageTitle } from './shared/PageTitle';
import { I18n } from '@kineticdata/react';

const CreationForm = ({ onChange, values, errors }) => (
  <div className="form-group">
    <label htmlFor="title">Title</label>
    <input
      id="title"
      name="title"
      type="text"
      value={values.title}
      onChange={onChange}
    />
    {errors.title && (
      <small className="form-text text-danger">{errors.title}</small>
    )}
  </div>
);

const TeamComponent = ({
  teams,
  error,
  team,
  parent,
  subteams,
  creationFields,
  discussionsEnabled,
  me,
  userIsMember,
  openRequestToJoinForm,
  openRequestToLeaveForm,
}) => (
  <div className="page-container page-container--space-team">
    {error && <ErrorMessage />}
    {!error && !teams && <LoadingMessage />}
    {!error && teams && !team && <ErrorMessage title="Team not found" />}
    {team && (
      <div className={`page-panel`}>
        <PageTitle
          parts={[team && team.name, 'Teams']}
          breadcrumbs={[
            { label: 'Home', to: '/' },
            { label: 'Teams', to: '/teams' },
          ]}
          title="Team Profile"
          actions={[
            me.spaceAdmin && {
              label: 'Edit Team',
              icon: 'pencil',
              to: `/settings/teams/${team.slug}`,
            },
          ]}
        />

        <div className="cards">
          <Card
            bar={true}
            barColor="primary"
            barIcon={Utils.getIcon(team, 'users')}
          >
            <CardCol center={true}>
              <CardRow type="title">
                <I18n>{team.name}</I18n>
              </CardRow>
              <CardRow>
                <I18n>{team.description}</I18n>
              </CardRow>
              <CardRow>
                {userIsMember ? (
                  <button
                    onClick={openRequestToLeaveForm}
                    className="btn btn-primary btn-sm"
                  >
                    <I18n>Request to Leave</I18n>
                  </button>
                ) : (
                  <button
                    onClick={openRequestToJoinForm}
                    className="btn btn-primary btn-sm"
                  >
                    <I18n>Request to Join</I18n>
                  </button>
                )}
              </CardRow>
            </CardCol>
            <CardCol center={true}>
              {team.memberships.length === 0 ? (
                <CardRow className="text-muted">
                  <I18n>No members</I18n>
                </CardRow>
              ) : (
                <CardRow>
                  <AvatarList
                    users={team.memberships.map(m => m.user)}
                    className="justify-content-center"
                    all={true}
                  />
                </CardRow>
              )}
            </CardCol>
          </Card>
        </div>

        {parent && (
          <section>
            <h3 className="section__title">
              <span className="title">
                <I18n>Parent Team</I18n>
              </span>
            </h3>
            <div className="cards">
              <TeamCard key={parent.slug} team={parent} components={{ Link }} />
            </div>
          </section>
        )}
        {subteams.size > 0 && (
          <section>
            <h3 className="section__title">
              <span className="title">
                <I18n>Subteams</I18n>
              </span>
            </h3>
            <div className="cards">
              {subteams.map(subteam => (
                <TeamCard
                  key={subteam.slug}
                  team={subteam}
                  components={{ Link }}
                />
              ))}
            </div>
          </section>
        )}

        {userIsMember &&
          discussionsEnabled && (
            <section className="mt-5">
              <h3 className="section__title">
                <span className="title">
                  <I18n>Discussions</I18n>
                </span>
              </h3>
              <DiscussionsPanel
                withAside={true}
                itemType="Team"
                itemKey={team.slug}
                overrideClassName="discussions-container"
                me={me}
                pageSize={5}
                creationFields={creationFields}
                CreationForm={CreationForm}
                renderDiscussionsListHeader={({
                  handleCreateDiscussionClick,
                }) =>
                  handleCreateDiscussionClick ? (
                    <div className="d-flex justify-content-end mt-n4 mb-2">
                      <button
                        className="btn btn-white btn-sticky-top"
                        onClick={handleCreateDiscussionClick}
                      >
                        <span className="fa fa-fw fa-plus" />
                        <span>
                          <I18n>Create Discussion</I18n>
                        </span>
                      </button>
                    </div>
                  ) : null
                }
              />
            </section>
          )}
      </div>
    )}
  </div>
);

const mapStateToProps = (state, props) => {
  const teams = state.teams.data;
  const team = state.teams.data
    ? state.teams.data.find(t => t.slug === props.match.params.teamSlug)
    : null;
  const heirarchy = Utils.buildTeamHierarchy((team && team.name) || '');
  const teamsMap = teams
    ? teams.reduce((memo, item) => {
        memo[item.name] = item;
        return memo;
      }, {})
    : {};
  return {
    error: state.teams.error,
    teams,
    team,
    space: state.app.space,
    me: state.app.profile,
    adminKappSlug: Utils.getAttributeValue(
      state.app.space,
      'Admin Kapp Slug',
      'admin',
    ),
    userIsMember: team ? Utils.isMemberOf(state.app.profile, team.name) : false,
    parent: heirarchy.parent && teamsMap[heirarchy.parent.name],
    subteams:
      team &&
      teams.filter(
        t =>
          t.name !== team.name && t.name.replace(/::[^:]+$/, '') === team.name,
      ),
    discussionsEnabled: selectDiscussionsEnabled(state),
  };
};

const openRequestToJoinForm = ({ space, adminKappSlug, team }) => config =>
  openModalForm({
    kappSlug: adminKappSlug,
    formSlug: 'join-team-request',
    title: 'Request to Join',
    confirmationMessage: 'Your request has been submitted.',
    values: {
      'Team Name': team.name,
    },
  });

const openRequestToLeaveForm = ({ space, adminKappSlug, team }) => config =>
  openModalForm({
    kappSlug: adminKappSlug,
    formSlug: 'leave-team-request',
    title: 'Request to Leave',
    confirmationMessage: 'Your request has been submitted.',
    values: {
      'Team Name': team.name,
    },
  });

export const Team = compose(
  connect(mapStateToProps),
  withHandlers({
    openRequestToJoinForm,
    openRequestToLeaveForm,
  }),
  withProps(
    props =>
      props.team && {
        creationFields: {
          title: props.team.name || 'Team Discussion',
          description: props.team.name || '',
          owningTeams: [{ name: props.team.name }],
        },
      },
  ),
)(TeamComponent);
