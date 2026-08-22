import { _db, _user } from "@netuno/server-types"
import user from "#core/cluar/user.js"
import organization from "#core/cluar/organization.js"

export default {
  validPermissions: ({ organization: orgCode, allowedGroups }) => {
    const loggedPeople = user.getLoggedPeople();
    const currentOrg = organization.getOrganization(orgCode);
    const peopleGroups = organization.getPeopleGroupsByOrg(currentOrg.getInt("id"), loggedPeople.getInt("id"));
    return peopleGroups.some((group) => allowedGroups.includes(group.getString("code")));
  },

  isUserAuthorizedInOrganization: (params) => {
    const people = user.getLoggedPeople();
    const organization = params.getValues("organization");

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
                organization_people op ON org.id = op.organization_id
            WHERE 1 = 1 
                AND op.people_id = ${people.getInt("id")}
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
  }
};
