import { _db, _val, _req, _out } from "@netuno/server-types";
import cluar from "#core/cluar/main.js"

const organizationUid = _req.getString("uid");

const dbOrganization = _db.get("organization", organizationUid);

if (dbOrganization) {
  const organizationId = dbOrganization.getInt("id");

  const dbChildOrganizations = _db.query(`
      SELECT * FROM organization
      WHERE parent_id = ?::int
    `, organizationId
  );

  for (const dbChildOrganization of dbChildOrganizations) {
    const childOrganizationId = dbChildOrganization.getInt("id");
    _db.execute(`
        DELETE FROM organization_people
        WHERE organization_id = ?::int
      `, childOrganizationId
    );

    _db.execute(`DELETE FROM organization WHERE id = ?::int`, childOrganizationId);
  }

  _db.execute(`
      DELETE FROM organization_people
      WHERE organization_id = ?::int
    `, organizationId
  );

  _db.execute(`DELETE FROM organization WHERE uid = ?::uuid`, organizationUid);

  _out.json(_val.map().set("result", true));
} else {
  _out.json(_val.map().set("result", false).set("error", "not-found"));
}
