import { _db, _user } from "@netuno/server-types";
import user from "#core/cluar/user.js";
import organization from "#core/cluar/organization.js";
import response from "#core/cluar/response.js";

// logged user is allowed
// isAllowed: ({ organization: orgCode, allowedGroups }) => {
//   const loggedProfile = user.getProfile();
//   const currentOrg = organization.getByCode(orgCode);
//   const profileGroups = organization.getProfileGroupsByOrg(currentOrg.getInt("id"), loggedProfile.getInt("id"));
//   return profileGroups.some((group) => allowedGroups.includes(group.getString("code")));
// },

const isUserAuthorizedInOrganization = (organization) => {
  const profile = user.getProfile();

  const dbIsAuthorized = _db.queryFirst(`
      WITH RECURSIVE user_orgs AS (
          SELECT
              org.name,
              org.id,
              org.parent_id,
              org.code,
              org.uid,
              org.active
          FROM
              organization org
          INNER JOIN
              organization_profile op ON org.id = op.organization_id
          WHERE 1 = 1
              AND op.profile_id = ${profile.getInt("id")}
              AND op.user_group_id = (SELECT id FROM user_group WHERE code = 'administrator')
              AND op.active = true
          UNION
          SELECT
              org.name,
              org.id,
              org.parent_id,
              org.code,
              org.uid,
              org.active
          FROM
              organization org
          INNER JOIN user_orgs uo ON org.parent_id = uo.id
      )
      SELECT 1
      FROM user_orgs
      WHERE user_orgs.id = ?
  `, organization.getInt('id'));

  return !!dbIsAuthorized;
};

export default {
  isUserAuthorizedInOrganization,

  requireUserAuthorizedInOrganization: (organization) => {
    if (!isUserAuthorizedInOrganization(organization)) {
      response.error({
        status: 403,
        error_code: 'user-unauthorized',
        error: 'user not authorized in the organization',
      });
    }
  },

  requireOrganizationAdminAccess: (organizationUid) => {
    const userOganizations = user.getActiveAdminOrganizationsWithDescendants();
    if (!userOganizations.some((org) => org.getString("uid") === organizationUid)) {
      response.error({ status: 403, error: 'permission denied' });
    }
  }
};