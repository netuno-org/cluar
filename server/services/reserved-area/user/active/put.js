import { _db, _val, _req, _user } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const uid = _req.getString("uid");
const active = _req.getBoolean("active");

const dbProfile = _db.queryFirst(`
    SELECT
        count(op.organization_id) over(),
        p.id profile_id,
        p.profile_user_id,
        op.organization_id
    FROM profile p
    INNER join organization_profile op
    ON op.profile_id = p.id
    WHERE p.uid = ${_db.param("uid")}
`, uid);

if (!dbProfile) {
  cluar.response.error({
    status: 404,
    error: `user not found with uid: ${uid}`,
    error_code: "user-not-found"
  });
}

if (dbProfile.getInt("count") > 1) {
  cluar.permission.requireUserAuthorizedInRootOrganization();
} else {
  const userOrganizationId = dbProfile.getInt("organization_id");
  cluar.permission.requireUserAuthorizedInOrganization(userOrganizationId);
}

_user.update(
  dbProfile.getInt("profile_user_id"),
  _val.map()
    .set("active", active),
  false
);

_db.update(
  "profile",
  dbProfile.getInt("profile_id"),
  _val.map()
    .set("active", active)
);

cluar.response.successWithoutData({ status: 200 });
