/*
  * Functions that deal with the logged user
  */

import { _db, _user, _val } from "@netuno/server-types";

export default {
  getProfile: () => {
    return _db.form("profile")
      .where(
        _db.where("profile_user_id").equals(_user.id())
      )
      .first();
  },

  isAdminOfRootOrganization: () => {
    return !!_db.queryFirst(`
        SELECT 1
        FROM profile p
        INNER JOIN organization_profile op
            ON p.id = op.profile_id
        INNER JOIN organization o
            ON op.organization_id = o.id
        WHERE 1 = 1
            AND o.parent_id = 0
            AND op.user_group_id = (SELECT id FROM user_group WHERE code = 'administrator')
            AND op.active = true
            AND p.profile_user_id = ${_db.param("id")}`
      , _user.id);
  },

  /*
   * Organization of the logged user used as a fallback when something has to
   * be assigned to "the user's organization".
   *
   * The fallback has to stay inside the hierarchy of the organization that is
   * being given up, otherwise the page would jump to an unrelated branch of the
   * tree. With "base -> a" and "base -> b -> b1 -> b2", a user administering
   * both "a" and "b" removing the last organization of a page from "b2"
   * reassigns it to "b", never to "a".
   *
   * Therefore the organization itself is excluded and only its ancestors that
   * the user actively administers are candidates. When several qualify the
   * closest one is used, which keeps the page as deep in the tree as possible.
   * Returns null when the user administers no ancestor, so the caller can
   * refuse the operation instead of moving the page somewhere unrelated.
   *
   * Matches the anchor condition of the authorized organizations recursive
   * query: an active membership in the "administrator" group.
   */
  getAdministratorOrganization: (organizationId) => {
    return _db.queryFirst(`
        WITH RECURSIVE ancestors(id, uid, name, code, parent_id, depth) AS(
            SELECT
                organization.id,
                organization.uid,
                organization.name,
                organization.code,
                organization.parent_id,
                0
            FROM organization
            WHERE 1 = 1
                AND organization.id = ${_db.param("int")} 
            UNION ALL
            SELECT
                parent.id,
                parent.uid,
                parent.name,
                parent.code,
                parent.parent_id,
                ancestors.depth + 1
            FROM organization parent
            INNER JOIN ancestors ON parent.id = ancestors.parent_id
        )
        SELECT
            ancestors.id,
            ancestors.uid,
            ancestors.name,
            ancestors.code
        FROM ancestors
        INNER JOIN organization_profile
            ON ancestors.id = organization_profile.organization_id
        INNER JOIN profile
            ON organization_profile.profile_id = profile.id
        INNER JOIN user_group
            ON organization_profile.user_group_id = user_group.id
        WHERE 1 = 1
            AND ancestors.depth > 0
            AND profile.profile_user_id = ${_db.param("int")}
            AND organization_profile.active = true
            AND user_group.code = 'administrator'
        ORDER BY ancestors.depth ASC
        LIMIT 1
      `, organizationId, _user.id());
  },

  getOrganizationsWithDescendants: ({ active = true, admin = true }) => {
    const dbOrganizations = _db.query(`
        WITH RECURSIVE user_orgs(name, id, parent_id, code, uid, active) AS(
            SELECT
                org.name,
                org.id,
                org.parent_id,
                org.code,
                org.uid,
                org.active
            FROM organization org
            INNER JOIN organization_profile op
                ON org.id = op.organization_id
            INNER JOIN profile p
                ON op.profile_id = p.id
            WHERE 1 = 1
                ${admin ? "AND op.user_group_id = (SELECT id FROM user_group WHERE code = 'administrator')" : ""}
                AND p.profile_user_id = ${_db.param("int")}
                ${active ? "AND op.active = true" : ""} 

            UNION

            SELECT
                org.name,
                org.id,
                org.parent_id,
                org.code,
                org.uid,
                org.active
            FROM organization org
            INNER JOIN user_orgs uo ON org.parent_id = uo.id
        )
        SELECT
            user_orgs.name,
            user_orgs.code,
            user_orgs.uid,
            user_orgs.id
        FROM user_orgs
      `,
      _user.id()
    );

    return dbOrganizations;
  },
};
