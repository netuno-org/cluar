import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const peopleUid = _req.getString('people_uid');
const organizationUid = _req.getString('organization_uid');

const dbPeople = _db.queryFirst(`SELECT id FROM people WHERE uid = ?::uuid`, peopleUid);
if (!dbPeople) {
  cluar.response.error({ status: 404, error: 'user not found' });
}
const peopleId = dbPeople.getInt("id");

const dbOrganization = _db.queryFirst(`SELECT id FROM organization WHERE uid = ?::uuid`, organizationUid);
if (!dbOrganization) {
  cluar.response.error({ status: 404, error: 'organization not found' });
}
const organizationId = dbOrganization.getInt("id");

const dbMembership = _db.queryFirst(`
    SELECT id
    FROM organization_people
    WHERE 1 = 1
        AND people_id = ?::int
        AND organization_id = ?::int
  `, peopleId, organizationId);

if (!dbMembership) {
  cluar.response.error({ status: 404, error: 'membership not found' });
}

const membershipCount = _db.form("organization_people")
  .where(_db.where("people_id").equals(peopleId))
  .count();

if (membershipCount <= 1) {
  cluar.response.error({
    status: 409,
    error: 'cannot remove membership, a user must be in at least one organization'
  });
}

_db.delete('organization_people', dbMembership.getInt("id"));

cluar.response.successWithoutData({ status: 200 });
