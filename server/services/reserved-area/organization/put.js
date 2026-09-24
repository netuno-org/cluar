import { _db, _val, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const {
  uid,
  name,
  code,
  parent_code,
  active
} = JSON.parse(_req.toJSON());

const dbOrganization = _db.get("organization", uid);

if (!dbOrganization) {
  cluar.response.error({
    status: 404,
    error_code: "organization-not-found",
    error: `organization not found with uid: ${uid}`
  });
}

cluar.permission.requireUserAuthorizedInOrganization(dbOrganization);

const codeAlreadyInUse = _db.queryFirst(`
    SELECT 1
    FROM organization
    WHERE 1 = 1
        AND code = ? AND id != ?    
`, code, dbOrganization.getInt("id"));

if (codeAlreadyInUse) {
  cluar.response.error({
    status: 409,
    error_code: "code-already-in-use",
    error: `the code ${code} is already in use by another organization`
  });
}

let dbParent = null;

if (parent_code) {
  dbParent = _db.queryFirst("SELECT id FROM organization WHERE code = ?", parent_code);
  if (!dbParent) {
    cluar.response.error({
      status: 404,
      error_code: "parent-organization-not-found",
      error: `parent organization not found with code: ${parent_code}`
    });
  }

  if (dbParent.getInt("id") == dbOrganization.getInt("id")) {
    cluar.response.error({
      status: 409,
      error_code: "hierarchy-breakdown",
      error: "the organization cannot have itself as parent"
    });
  }

  cluar.permission.requireUserAuthorizedInOrganization(dbParent);

  const isParentDescendant = cluar.organization.isAncestorOf(
    _val.map()
      .set("ancestor", dbOrganization)
      .set("descendant", dbParent)
  );

  if (isParentDescendant) {
    cluar.response.error({
      status: 409,
      error_code: "hierarchy-breakdown",
      error: "an organization cannot have as parent an organization below its hierarchy"
    });
  }
}

_db.update(
  "organization",
  dbOrganization.getInt("id"),
  _val.map()
    .set("active", active)
    .set("name", name)
    .set("code", code)
    .set("parent_id", dbParent ? dbParent.getInt("id") : 0)
);

cluar.response.successWithoutData({ status: 200 });
