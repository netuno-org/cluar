import groups from "#core/consts/group.js";
import { _db, _user } from "@netuno/server-types";

const permission = {
    getLoggedPeople: () => {
        return _db.form("people")
            .where(
                _db.where("people_user_id").equals(_user.id())
            )
            .first();
    },

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

    validPermissions: ({ organization, allowedGroups }) => {
        const loggedPeople = permission.getLoggedPeople();
        const currentOrg = permission.getOrganization(organization);
        const peopleGroups = permission.getPeopleGroupsByOrg(currentOrg.getInt("id"), loggedPeople.getInt("id"));
        return peopleGroups.some((group) => allowedGroups.includes(group.getString("code")));
    }
}

export default permission;
