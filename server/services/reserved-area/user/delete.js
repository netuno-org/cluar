import { _db, _val, _out, _exec, _user, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js"

const profileUid = _req.getString("uid");

const dbProfile = _db.queryFirst(`
    SELECT * FROM profile WHERE uid = ?::uuid 
`, profileUid);

const loggedUserUid = cluar.user.getProfile().getString("uid");
if (profileUid === loggedUserUid) {
  cluar.response.error({ status: 409, error: "users cannot delete themselves" });
}

if (!dbProfile) {
  cluar.response.error({ status: 404, error: "user not found" });
}

// o usuário só pode ser deletado se ele perterncer à apenas uma organização
// essa organização deve estar na árvore de organizações do usuário logado
const profileId = dbProfile.getInt("id");
const membership = _db.queryFirst(`
    SELECT
        count(*) over(),
        organization.uid as user_organization_uid
    FROM organization_profile
    INNER JOIN organization
    ON organization_profile.organization_id = organization.id
    WHERE profile_id = ${_db.param("int")} 
`, profileId);

if (membership.getInt("count") > 1) {
  cluar.response.error({
    status: 409,
    error: 'Cannot remove user, they belong to more than one organization.'
  });
}

const userOrganizationUid = membership.getString("user_organization_uid");
cluar.permission.requireOrganizationAdminAccess(userOrganizationUid);

_db.execute(`DELETE from organization_profile WHERE profile_id = ${profileId}`);
_db.delete(
  "profile",
  profileId
);
_user.remove(dbProfile.getInt("profile_user_id"));
_out.json(
  _val.map()
    .set("result", true)
);
