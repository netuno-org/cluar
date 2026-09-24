import { _db, _val, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const {
  uid,
  profile_uid,
  organization_code,
  group_code,
  active
} = JSON.parse(_req.toJSON());

const dbMember = _db.queryFirst("SELECT id FROM organization_profile WHERE uid = ?::uuid", uid);

if (!dbMember) {
  cluar.response.error({
    status: 404,
    error: `member not found with uid: ${uid}`,
    error_code: "member-not-found"
  });
}

const dbProfile = _db.queryFirst("SELECT id, uid, name FROM profile WHERE uid = ?::uuid", profile_uid);

if (!dbProfile) {
  cluar.response.error({
    status: 404,
    error: `profile not found with uid: ${profile_uid}`,
    error_code: "profile-not-found"
  });
}

const dbOrganization = _db.queryFirst("SELECT id, name, code FROM organization WHERE code = ?::varchar", organization_code);

if (!dbOrganization) {
  cluar.response.error({
    status: 404,
    error: `organization not found with code: ${organization_code}`,
    error_code: "organization-not-found"
  });
}

cluar.permission.requireUserAuthorizedInOrganization(dbOrganization);

const dbGroup = _db.queryFirst("SELECT id, name, code FROM user_group WHERE code = ?::varchar", group_code);

if (!dbGroup) {
  cluar.response.error({
    status: 404,
    error: `group not found with code: ${group_code}`,
    error_code: "group-not-found"
  });
}

const memberAlreadyExists = _db.queryFirst(`
    SELECT 1
    FROM organization_profile
    WHERE 1 = 1
     AND profile_id = ?::integer
     AND organization_id = ?::integer
     AND id != ?::integer 
 `, _val.init()
  .add(dbProfile.getInt("id"))
  .add(dbOrganization.getInt("id"))
  .add(dbMember.getInt("id"))
);

if (memberAlreadyExists) {
  cluar.response.error({
    status: 409,
    error: "this person is already a member of this organization, but you can manage your group",
    error_code: "person-already-member"
  });
}

const memberData = _val.map()
  .set("organization_id", dbOrganization.getInt("id"))
  .set("profile_id", dbProfile.getInt("id"))
  .set("user_group_id", dbGroup.getInt("id"))
  .set("active", active);

_db.update(
  "organization_profile",
  dbMember.getInt("id"),
  memberData
);

cluar.response.successWithoutData({ status: 200 });
