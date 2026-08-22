import { _db } from "@netuno/server-types";

export default {
  getOrganization: (code) => {
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

  organizationIsDescendant: (params) => {
    const organizationChildren = params.getValues("organizationChildren");
    const organizationParent = params.getValues("organizationParent");

    const isDescendant = _db.queryFirst(`
        WITH RECURSIVE childrens AS (
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
               AND org.id = ${organizationChildren.getInt("id")}
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
                childrens cs ON org.parent_id = cs.id
        )
        SELECT 1
        FROM childrens
        WHERE 1 = 1
            AND childrens.id = ${organizationParent.getInt("id")}
      `);
    return !!isDescendant;
  }
};
