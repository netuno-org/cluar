import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const {
  profile_uid,
  organization_code,
  group_code,
  active
} = JSON.parse(_req.toJSON());


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
`, dbProfile.getInt("id"), dbOrganization.getInt("id"));

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

const createdMember = cluar.db.insertAndReturn("organization_profile", memberData);

_header.status(201);
_out.json(
  _val.map()
    .set('result', true)
    .set('member', _val.map()
      .set('uid', createdMember.getString("uid"))
      .set('active', createdMember.getBoolean("active"))
      .set('profile', _val.map()
        .set('name', dbProfile.getString("name"))
        .set('uid', dbProfile.getString("uid"))
      )
      .set('group', _val.map()
        .set('name', dbGroup.getString("name"))
        .set('code', dbGroup.getString("code"))
      )
      .set('organization', _val.map()
        .set('name', dbOrganization.getString("name"))
        .set('code', dbOrganization.getString("code"))
      )
    )
);
