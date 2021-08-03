import { Utils } from '@kineticdata/bundle-common';

// Role Selectors
export const selectHasRoleDataAdmin = state =>
  !state.app.loading
    ? state.app.authenticated &&
      Utils.isMemberOf(state.app.profile, 'Role::Data Admin')
    : false;
export const selectHasRoleSubmissionSupport = state =>
  !state.app.loading
    ? state.app.authenticated &&
      Utils.isMemberOf(state.app.profile, 'Role::Submission Support')
    : false;
export const selectHasAccessToManagement = state =>
  !state.app.loading
    ? state.app.authenticated &&
      (state.app.profile.spaceAdmin ||
        selectHasRoleDataAdmin(state) ||
        Utils.getTeams(state.app.profile).length > 0)
    : false;
export const selectHasAccessToSupport = state =>
  !state.app.loading
    ? state.app.authenticated &&
      (state.app.profile.spaceAdmin || selectHasRoleSubmissionSupport(state))
    : false;
export const selectHasUserAccess = state =>
  !state.app.loading
    ? state.app.authenticated &&
      (state.app.profile.spaceAdmin ||
        (state.app.space.authorization &&
          state.app.space.authorization['Users Access']))
    : false;
export const selectHasTeamAccess = state =>
  !state.app.loading
    ? state.app.authenticated &&
      (state.app.profile.spaceAdmin ||
        (state.app.space.authorization &&
          state.app.space.authorization['Teams Access']))
    : false;

export const selectMenuLinks = object =>
  object
    ? Utils.getAttributeValues(object, 'Menu Link', [])
        .map(link => {
          const linkParts = link.split('|');
          const label = linkParts[0] && linkParts[0].trim();
          const path = linkParts[1] && linkParts[1].trim();
          const relative = path && path.startsWith('/');
          const icon = linkParts[2] && linkParts[2].trim();
          return !!label && !!path
            ? {
                label,
                path,
                relative,
                icon: icon
                  ? icon.startsWith('fa-')
                    ? icon
                    : `fa-${icon}`
                  : relative
                    ? 'fa-arrow-circle-right'
                    : 'fa-external-link-square',
              }
            : null;
        })
        .filter(Boolean)
    : [];
