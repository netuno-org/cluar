import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const {
  uid,
  profile_uid,
  organization_code,
  group_code,
  active
} = JSON.parse(_req.toJSON());

const dbMember = _db.queryFirst(`SELECT id FROM organization_profile WHERE uid = ?::uuid`, uid);

if (!dbMember) {
  _header.status(404);
  _out.json(
    _val.map()
      .set('result', false)
      .set('error', `member not found with uid: ${uid}`)
      .set('error_code', `member-not-found`)
  );
  _exec.stop();
}

const dbProfile = _db.queryFirst(`SELECT id, uid, name FROM profile WHERE uid = ?::uuid`, profile_uid);

if (!dbProfile) {
  _header.status(404);
  _out.json(
    _val.map()
      .set('result', false)
      .set('error', `profile not found with uid: ${profile_uid}`)
      .set('error_code', `profile-not-found`)
  );
  _exec.stop();
}

const dbOrganization = _db.queryFirst(`SELECT id, name, code FROM organization WHERE code = ?::varchar`, organization_code);

if (!dbOrganization) {
  _header.status(404);
  _out.json(
    _val.map()
      .set('result', false)
      .set('error', `organization not found with uid: ${organization_code}`)
      .set('error_code', `organization-not-found`)
  );
  _exec.stop();
}

cluar.permission.requireUserAuthorizedInOrganization(dbOrganization);

const dbGroup = _db.queryFirst(`SELECT id, name, code FROM user_group WHERE code = ?::varchar`, group_code);

if (!dbGroup) {
  _header.status(404);
  _out.json(
    _val.map()
      .set('result', false)
      .set('error', `group not found with uid: ${group_code}`)
      .set('error_code', `group-not-found`)
  );
  _exec.stop();
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
  _header.status(409);
  _out.json(
    _val.map()
      .set('result', false)
      .set('error', `this person is already a member of this organization, but you can manage your group`)
      .set('error_code', `person-already-member`)
  );
  _exec.stop();
}

const memberData = _val.map()
  .set("organization_id", dbOrganization.getInt("id"))
  .set("profile_id", dbProfile.getInt("id"))
  .set("user_group_id", dbGroup.getInt("id"))
  .set("active", active);

_db.update(
  'organization_profile',
  dbMember.getInt("id"),
  memberData
);

_out.json(
  _val.map()
    .set('result', true)
);
