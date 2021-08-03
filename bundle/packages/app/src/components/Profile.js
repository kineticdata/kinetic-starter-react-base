import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withProps } from 'recompose';
import { Link } from 'react-router-dom';
import {
  CardRow,
  EmptyMessage,
  ErrorMessage,
  LoadingMessage,
  ProfileCard,
  TeamCard,
  Utils,
} from '@kineticdata/bundle-common';
import { actions } from '../redux/modules/profile';
import { PageTitle } from './shared/PageTitle';
import { I18n } from '@kineticdata/react';

const ProfileComponent = ({
  me,
  profile,
  error,
  department,
  departmentEnabled,
  organization,
  organizationEnabled,
  site,
  siteEnabled,
  manager,
  managerEnabled,
}) => (
  <div className="page-container">
    {!error && !profile && <LoadingMessage />}
    {error && (
      <ErrorMessage title="Could not load profile" message={error.message} />
    )}
    {profile && (
      <div className="page-panel">
        <PageTitle
          parts={['Profile']}
          breadcrumbs={[{ label: 'Home', to: '/' }]}
          title="Profile"
          actions={[
            profile.username === me.username && {
              label: 'Edit Profile',
              icon: 'pencil',
              to: '/profile/edit',
            },
          ]}
        />

        <div className="cards">
          <ProfileCard user={profile} hideProfileLink={true} inline={true}>
            <>
              <CardRow type="multi" className="py-3">
                {Utils.getRoles(profile).map(role => (
                  <span
                    className="badge badge-subtle badge-pill"
                    key={role.slug}
                  >
                    <I18n>{role.name.replace(/^Role::(.*?)/, '$1')}</I18n>
                  </span>
                ))}
              </CardRow>
              {(managerEnabled ||
                siteEnabled ||
                departmentEnabled ||
                organizationEnabled) && (
                <CardRow type="meta">
                  <dl>
                    {managerEnabled && (
                      <div>
                        <dt>
                          <I18n>Manager</I18n>
                        </dt>
                        <dd>
                          {manager ? (
                            <I18n>{manager}</I18n>
                          ) : (
                            <em className="text-muted">
                              <I18n>No Manager</I18n>
                            </em>
                          )}
                        </dd>
                      </div>
                    )}
                    {departmentEnabled && (
                      <div>
                        <dt>
                          <I18n>Department</I18n>
                        </dt>
                        <dd>
                          {department ? (
                            <I18n>{department}</I18n>
                          ) : (
                            <em className="text-muted">
                              <I18n>No Department</I18n>
                            </em>
                          )}
                        </dd>
                      </div>
                    )}
                    {organizationEnabled && (
                      <div>
                        <dt>
                          <I18n>Organization</I18n>
                        </dt>
                        <dd>
                          {organization ? (
                            <I18n>{organization}</I18n>
                          ) : (
                            <em className="text-muted">
                              <I18n>No Organization</I18n>
                            </em>
                          )}
                        </dd>
                      </div>
                    )}
                    {siteEnabled && (
                      <div>
                        <dt>
                          <I18n>Site</I18n>
                        </dt>
                        <dd>
                          {site ? (
                            <I18n>{site}</I18n>
                          ) : (
                            <em className="text-muted">
                              <I18n>No Site</I18n>
                            </em>
                          )}
                        </dd>
                      </div>
                    )}
                  </dl>
                </CardRow>
              )}
            </>
          </ProfileCard>
        </div>

        <section>
          <h2 className="section__title">
            <I18n>Teams</I18n>
          </h2>
          <div className="cards">
            {Utils.getTeams(profile).map(team => (
              <TeamCard key={team.slug} team={team} components={{ Link }} />
            ))}
            {Utils.getTeams(profile).length === 0 && (
              <EmptyMessage title="User is not a member of any teams" />
            )}
          </div>
        </section>
      </div>
    )}
  </div>
);

const selectAttributes = profile =>
  profile
    ? {
        departmentEnabled: Utils.hasAttributeDefinition(
          profile.space.userAttributeDefinitions,
          'Department',
        ),
        department: Utils.getAttributeValue(profile, 'Department'),
        managerEnabled: Utils.hasAttributeDefinition(
          profile.space.userAttributeDefinitions,
          'Manager',
        ),
        manager: Utils.getAttributeValue(profile, 'Manager'),
        organizationEnabled: Utils.hasAttributeDefinition(
          profile.space.userAttributeDefinitions,
          'Organization',
        ),
        organization: Utils.getAttributeValue(profile, 'Organization'),
        siteEnabled: Utils.hasAttributeDefinition(
          profile.space.userAttributeDefinitions,
          'Site',
        ),
        site: Utils.getAttributeValue(profile, 'Site'),
      }
    : {};

export const mapStateToProps = state => ({
  me: state.app.profile,
  profile: state.profile.data,
  error: state.profile.error,
  ...selectAttributes(state.profile.data),
});

export const mapDispatchToProps = {
  fetchProfileRequest: actions.fetchProfileRequest,
};

export const Profile = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(({ match: { params: { username } } }) => ({
    username: decodeURIComponent(username),
  })),
  lifecycle({
    componentDidMount() {
      this.props.fetchProfileRequest(this.props.username);
    },
    componentDidUpdate(prevProps) {
      if (this.props.username !== prevProps.username) {
        this.props.fetchProfileRequest(this.props.username);
      }
    },
  }),
)(ProfileComponent);
