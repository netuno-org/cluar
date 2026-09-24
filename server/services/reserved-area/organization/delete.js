import { _db, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js"

const organizationUid = _req.getString("uid");

const dbOrganization = _db.get("organization", organizationUid);

if (!dbOrganization) {
  cluar.response.error({ status: 404, error: "organization not found", error_code: "organization-not-found" });
}

cluar.permission.requireUserAuthorizedInOrganization(dbOrganization);

const organizationId = dbOrganization.getInt("id");

const dbOrganizationAndChildren = _db.query(`
    WITH RECURSIVE org_and_children AS (
        SELECT id, uid, active, code, name, parent_id
        FROM organization
        WHERE id = ?::int

        UNION

        SELECT org.id, org.uid, org.active, org.code, org.name, org.parent_id
        FROM organization org
        INNER JOIN org_and_children oac
        ON org.parent_id = oac.id
    )
    SELECT *
    FROM org_and_children;
  `, organizationId
);

for (const dbOrgOrChild of dbOrganizationAndChildren) {
  const orgOrChildId = dbOrgOrChild.getInt("id");
  const membership = _db.form("organization_profile")
    .where(_db.where("organization_id").equals(orgOrChildId));

  if (membership.count() >= 1) {
    cluar.response.error({
      status: 409,
      error_code: "organization-has-members",
      error: "there are members in this organization or one of its children, cannot remove it"
    });
  }
}

for (const dbOrgOrChild of dbOrganizationAndChildren) {
  const orgOrChildId = dbOrgOrChild.getInt("id");
  _db.execute(`
      DELETE FROM organization_profile
      WHERE organization_id = ?::int
    `, orgOrChildId
  );

  _db.execute("DELETE FROM organization WHERE id = ?::int", orgOrChildId);
}

cluar.response.successWithoutData({ status: 200 });
