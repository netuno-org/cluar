import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const profileUid = _req.getString('profile_uid');
const organizationUid = _req.getString('organization_uid');

const dbProfile = _db.queryFirst(`SELECT id FROM profile WHERE uid = ?::uuid`, profileUid);
if (!dbProfile) {
  cluar.response.error({ status: 404, error: 'user not found' });
}
const profileId = dbProfile.getInt("id");

const dbOrganization = _db.queryFirst(`SELECT id FROM organization WHERE uid = ?::uuid`, organizationUid);
if (!dbOrganization) {
  cluar.response.error({ status: 404, error: 'organization not found' });
}
const organizationId = dbOrganization.getInt("id");

const dbMembership = _db.queryFirst(`
    SELECT id
    FROM organization_profile
    WHERE 1 = 1
        AND profile_id = ?::int
        AND organization_id = ?::int
  `, profileId, organizationId);

if (!dbMembership) {
  cluar.response.error({ status: 404, error: 'membership not found' });
}

const membershipCount = _db.form("organization_profile")
  .where(_db.where("profile_id").equals(profileId))
  .count();

if (membershipCount <= 1) {
  cluar.response.error({
    status: 409,
    error: 'Cannot remove membership, a user must be in at least one organization'
  });
}

_db.delete('organization_profile', dbMembership.getInt("id"));

cluar.response.successWithoutData({ status: 200 });
