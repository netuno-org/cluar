import { _db } from "@netuno/server-types";

export default {
  getByCode: (code) => {
    return _db.form("organization")
      .where(
        _db.where("code").equals(code)
      )
      .first();
  },

  getPeopleGroupsByOrg: (organizationId, peopleId) => {
    return _db.form("organization_people")
      .where(
        _db.where("organization_id").equals(organizationId)
          .and("people_id").equals(peopleId)
          .and("active").equals(true)
      )
      .link("user_group")
      .get("user_group.id")
      .get("user_group.uid")
      .get("user_group.name")
      .get("user_group.code")
      .all();
  },

  isAncestorOf: (params) => {
    const ancestor = params.getValues("ancestor");
    const descendant = params.getValues("descendant");

    const isAncestor = _db.queryFirst(`
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
               AND org.id = ${ancestor.getInt("id")}
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
                descendant d ON org.parent_id = d.id
        )
        SELECT 1
        FROM descendant
        WHERE 1 = 1
            AND descendant.id = ${descendant.getInt("id")}
    `);
    return !!isAncestor;
  }
};
