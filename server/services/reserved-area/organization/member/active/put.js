import { _db, _val, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const {
  uid,
  active
} = JSON.parse(_req.toJSON());

const dbMembership = _db.queryFirst(`
    SELECT organization_profile.id membership_id, organization.id organization_id
    FROM organization_profile
    INNER JOIN organization
    ON organization.id = organization_profile.organization_id
    WHERE organization_profile.uid = ${_db.param("uid")}`
  , uid);

if (!dbMembership) {
  cluar.response.error({
    status: 404,
    error: `member not found with uid: ${uid}`,
    error_code: "member-not-found"
  });
}

const userOrganizationId = dbMembership.getInt("organization_id");
cluar.permission.requireUserAuthorizedInOrganization(userOrganizationId);

_db.update(
  "organization_profile",
  dbMembership.getInt("membership_id"),
  _val.map()
    .set("active", active)
);

cluar.response.successWithoutData({ status: 200 });
