import { _db } from "@netuno/server-types";
import user from "#core/cluar/user.js";
import response from "#core/cluar/response.js";

/*
 * Set of organizations the logged user effectively administers: the
 * organizations where they are an active "administrator" member, plus every
 * descendant of those organizations (recursively).
 *
 * The recursive step only descends, so a member of "a" is authorized in "a"
 * and everything below it, but never in its ancestors. "UNION" (rather than
 * "UNION ALL") dedupes the accumulated rows, which is what makes the walk
 * reach a fixed point and terminate.
 */
const AUTHORIZED_ORGANIZATIONS_CTE = `
    WITH RECURSIVE authorized_organizations(name, id, parent_id, code, uid, active) AS (
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
            AND op.profile_id = ?
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
        INNER JOIN authorized_organizations ao ON org.parent_id = ao.id
    )
`;

/*
 * An organization id is enough to identify what is being authorized, so the
 * caller only has to supply the id, never a whole organization record.
 *
 * A missing id (null, undefined or 0) means there is no organization to
 * authorize against, so the answer is "not authorized": failing closed makes it
 * impossible to bypass the check by forgetting to pass an organization.
 */
const isUserAuthorizedInOrganization = (organizationId) => {
  if (!organizationId) {
    return false;
  }

  const profile = user.getProfile();

  const dbIsAuthorized = _db.queryFirst(`${AUTHORIZED_ORGANIZATIONS_CTE}
      SELECT 1
      FROM authorized_organizations
      WHERE authorized_organizations.id = ?
  `, profile.getInt("id"), organizationId);

  return !!dbIsAuthorized;
};

/*
 * An entity associated with several organizations (a page, a profile) is
 * reachable by whoever administers at least one of them: the entity is shared,
 * so the organizations that do not know about it have no claim over it.
 *
 * Requiring every organization would lock the entity away from any
 * administrator that shares only part of it, with no one able to fix it.
 *
 * An empty list means there is no organization to be authorized against, so the
 * answer is "not authorized", unlike a page with no organizations, which is
 * left to the organization it is about to be associated with.
 */
const isUserAuthorizedInAnyOrganization = (organizationIds) => {
  for (const organizationId of organizationIds) {
    if (isUserAuthorizedInOrganization(organizationId)) {
      return true;
    }
  }

  return false;
};

/*
 * A page belongs to every organization associated with it, and a user is
 * authorized when they administer at least one of them.
 *
 * A page with no organizations is not scoped to any, so there is nothing to
 * be authorized against and the check is vacuously satisfied - the caller is
 * then left to check the organization it is about to associate.
 */
const isUserAuthorizedInAnyOrganizationOfPage = (pageId) => {
  const dbOrganizationsCount = _db.queryFirst(`
      SELECT COUNT(1) AS "total"
      FROM page_organization
      WHERE page_organization.page_id = ?::int
  `, pageId);

  if (!dbOrganizationsCount || dbOrganizationsCount.getInt("total") === 0) {
    return true;
  }

  const profile = user.getProfile();

  const dbIsAuthorized = _db.queryFirst(`${AUTHORIZED_ORGANIZATIONS_CTE}
      SELECT 1
      FROM authorized_organizations
      INNER JOIN page_organization
          ON page_organization.organization_id = authorized_organizations.id
      WHERE 1 = 1
          AND page_organization.page_id = ?
      LIMIT 1
  `, profile.getInt("id"), pageId);

  return !!dbIsAuthorized;
};

/*
 * Pages the logged user is allowed to see: every page associated with at
 * least one organization they effectively administer.
 *
 * Pages without any organization are reachable only by the administrators of
 * the root organizations, otherwise they would be orphaned - unreachable from
 * the reserved area and impossible to repair or delete.
 */
const getAuthorizedPages = () => {
  const profile = user.getProfile();

  return _db.query(`${AUTHORIZED_ORGANIZATIONS_CTE}
      SELECT
          page.id,
          page.uid,
          page.title,
          page.link,
          page.parent_id,
          page.sorter
      FROM
          page
      INNER JOIN page_organization
          ON page_organization.page_id = page.id
      INNER JOIN authorized_organizations
          ON authorized_organizations.id = page_organization.organization_id
      WHERE 1 = 1
          AND page.active = TRUE
      UNION
      SELECT
          page.id,
          page.uid,
          page.title,
          page.link,
          page.parent_id,
          page.sorter
      FROM
          page
      WHERE 1 = 1
          AND page.active = TRUE
          AND NOT EXISTS (
              SELECT 1
              FROM page_organization
              WHERE page_organization.page_id = page.id
          )
          AND EXISTS (
              SELECT 1
              FROM authorized_organizations
              WHERE authorized_organizations.parent_id = 0
          )
  `, profile.getInt("id"));
};

export default {
  isUserAuthorizedInOrganization,
  isUserAuthorizedInAnyOrganization,
  isUserAuthorizedInAnyOrganizationOfPage,
  getAuthorizedPages,

  requireUserAuthorizedInOrganization: (organizationId) => {
    if (!isUserAuthorizedInOrganization(organizationId)) {
      response.error({
        status: 403,
        error_code: "user-unauthorized",
        error: "user not authorized in the organization",
      });
    }
  },

  requireUserAuthorizedInAnyOrganization: (organizationIds) => {
    if (!isUserAuthorizedInAnyOrganization(organizationIds)) {
      response.error({
        status: 403,
        error_code: "user-unauthorized",
        error: "user not authorized in any of these organizations",
      });
    }
  },

  requireUserAuthorizedInAnyOrganizationOfPage: (pageId) => {
    if (!isUserAuthorizedInAnyOrganizationOfPage(pageId)) {
      response.error({
        status: 403,
        error_code: "user-unauthorized",
        error: "user not authorized in any organization of this page",
      });
    }
  },

  requireUserAuthorizedInRootOrganization: () => {
    if (!user.isAdminOfRootOrganization()) {
      response.error({
        status: 403,
        error_code: "user-unauthorized",
        error: "user not authorized in the root organization",
      });
    }
  },
};
