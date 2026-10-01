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
        WITH RECURSIVE ancestors(id, uid, name, code, parent_id, depth) AS (
            SELECT
                organization.id,
                organization.uid,
                organization.name,
                organization.code,
                organization.parent_id,
                0
            FROM organization
            WHERE 1 = 1
                AND organization.id = ?::int
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
            AND profile.profile_user_id = ?
            AND organization_profile.active = true
            AND user_group.code = 'administrator'
        ORDER BY ancestors.depth ASC
        LIMIT 1
    `, organizationId, _user.id());
  },

  getActiveAdminOrganizationsWithDescendants: () => {
    const dbProfile = _db.queryFirst("SELECT id FROM profile WHERE profile_user_id = ?", _user.id());

    const dbOrganizations = _db.query(`
        WITH RECURSIVE user_orgs(name, id, parent_id, code, uid, active) AS (
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
                AND op.profile_id = ${dbProfile.getInt("id")}
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
        SELECT
            user_orgs.name,
            user_orgs.code,
            user_orgs.uid,
            user_orgs.id
        FROM
            user_orgs
        WHERE 1 = 1
    `);

    return dbOrganizations;
  },

  getOrganizationsWithDescendants: () => {
    const dbProfile = _db.queryFirst("SELECT id FROM profile WHERE profile_user_id = ?", _user.id());

    const dbOrganizations = _db.query(`
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
                AND op.profile_id = ${dbProfile.getInt("id")}
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
        SELECT DISTINCT ON (user_orgs.id)
            user_orgs.name org_name,
            user_orgs.code org_code,
            user_orgs.uid AS org_uid,
            user_orgs.id AS org_id,
            profile.name AS profile_name,
            profile.uid AS profile_uid,
            profile.id AS profile_id,
            user_group.name AS group_name,
            user_group.code AS group_code,
            organization_profile.active AS member_active
        FROM
            user_orgs
        INNER JOIN
            organization_profile ON organization_profile.organization_id = user_orgs.id
        INNER JOIN
            profile ON profile.id = organization_profile.profile_id
        INNER JOIN
            user_group ON user_group.id = organization_profile.user_group_id
         WHERE 1 = 1
            AND profile.id = ${dbProfile.getInt("id")}
    `);

    const hierarchy = _val.map();

    for (const dbOrganization of dbOrganizations) {
      hierarchy.set(
        dbOrganization.getString("org_code"),
        _val.map()
          .set("active", dbOrganization.getBoolean("member_active"))
          .set("organization",
            _val.map()
              .set("name", dbOrganization.getString("org_name"))
              .set("code", dbOrganization.getString("org_code"))
              .set("uid", dbOrganization.getString("org_uid"))
          )
          .set("group",
            _val.map()
              .set("name", dbOrganization.getString("group_name"))
              .set("code", dbOrganization.getString("group_code"))
          )
      );
      const dbDescendants = _db.query(`
          WITH RECURSIVE descendant AS (
             SELECT
                 org.name,
                 org.id,
                 org.parent_id,
                 org.code,
                 org.uid,
                 org.active
             FROM
                 organization org
             WHERE 1 = 1
                AND org.id = ${dbOrganization.getInt("org_id")}
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
             INNER JOIN
                 descendant cs ON org.parent_id = cs.id
         )
         SELECT
             descendant.name AS descendant_name,
             descendant.code AS descendant_code,
             descendant.uid AS descendant_uid,
             descendant.id AS descendant_id
         FROM
             descendant
      `);

      for (const dbDescendant of dbDescendants) {
        hierarchy.set(
          dbDescendant.getString("descendant_code"),
          _val.map()
            .set("active", dbOrganization.getBoolean("member_active"))
            .set("organization",
              _val.map()
                .set("name", dbDescendant.getString("descendant_name"))
                .set("code", dbDescendant.getString("descendant_code"))
                .set("uid", dbDescendant.getString("descendant_uid"))
            )
            .set("group",
              _val.map()
                .set("name", dbOrganization.getString("group_name"))
                .set("code", dbOrganization.getString("group_code"))
            )
        );

        const specificMember = _db.queryFirst(`
            SELECT
                user_group.name,
                user_group.code,
                organization_profile.active AS member_active
            FROM user_group
            INNER JOIN
                organization_profile ON organization_profile.user_group_id = user_group.id
            WHERE 1 = 1
                AND organization_profile.organization_id = ?
                AND organization_profile.profile_id = ?
        `, dbDescendant.getInt("descendant_id"), dbOrganization.getInt("profile_id"));

        if (specificMember) {
          hierarchy.set(
            dbDescendant.getString("descendant_code"),
            _val.map()
              .set("active", specificMember.getBoolean("member_active"))
              .set("organization",
                _val.map()
                  .set("name", dbDescendant.getString("descendant_name"))
                  .set("code", dbDescendant.getString("descendant_code"))
                  .set("uid", dbDescendant.getString("descendant_uid"))
              )
              .set("group",
                _val.map()
                  .set("name", specificMember.getString("name"))
                  .set("code", specificMember.getString("code"))
              )
          );
        }
      }
    }
    return hierarchy;
  }
};
