import { _db, _val, _req, _out } from "@netuno/server-types";
import cluar from "#core/cluar/main.js"

const organizationUid = _req.getString("uid");

const dbOrganization = _db.get("organization", organizationUid);

if (!dbOrganization) {
  cluar.response.error({ status: 404, error: "organization not found" });
}

const userOganizations = cluar.user.getActiveAdminOrganizationsWithDescendants();
if (!userOganizations.some((org) => org.getString("uid") === organizationUid)) {
  cluar.response.error({ status: 403, error: 'permission denied' });
}

const organizationId = dbOrganization.getInt("id");

const dbChildOrganizations = _db.query(`
    SELECT * FROM organization
    WHERE parent_id = ?::int
  `, organizationId
);

for (const dbChildOrganization of dbChildOrganizations) {
  const childOrganizationId = dbChildOrganization.getInt("id");
  _db.execute(`
      DELETE FROM organization_profile
      WHERE organization_id = ?::int
    `, childOrganizationId
  );

  _db.execute(`DELETE FROM organization WHERE id = ?::int`, childOrganizationId);
}

_db.execute(`
    DELETE FROM organization_profile
    WHERE organization_id = ?::int
  `, organizationId
);

_db.execute(`DELETE FROM organization WHERE uid = ?::uuid`, organizationUid);

_out.json(_val.map().set("result", true));
