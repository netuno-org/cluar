import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
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
  _header.status(404);
  _out.json(
    _val.map()
      .set("result", false)
      .set("error_code", "organization-not-found")
      .set("error", `organization not found with uid: ${uid}`)
  );
  _exec.stop();
}

cluar.permission.requireUserAuthorizedInOrganization(dbOrganization);

const codeAlreadyInUse = _db.queryFirst(`
    SELECT 1
    FROM organization
    WHERE 1 = 1
        AND code = ? AND id != ?    
`, code, dbOrganization.getInt("id"));

if (codeAlreadyInUse) {
  _header.status(409);
  _out.json(
    _val.map()
      .set("result", false)
      .set("error_code", "code-already-in-use")
      .set("error", `the code ${code} is already in use by another organization.`)
  );
  _exec.stop();
}

let dbParent = null;

if (parent_code) {
  dbParent = _db.queryFirst("SELECT id FROM organization WHERE code = ?", parent_code);
  if (!dbParent) {
    _header.status(404);
    _out.json(
      _val.map()
        .set("result", false)
        .set("error_code", "parent-organization-not-found")
        .set("error", `parent organization not found with code: ${parent_code}`)
    );
    _exec.stop();
  }

  if (dbParent.getInt("id") == dbOrganization.getInt("id")) {
    _header.status(409);
    _out.json(
      _val.map()
        .set("result", false)
        .set("error_code", "redundant-organization")
        .set("error", "the organization cannot have itself as parent")
    );
    _exec.stop();
  }

  cluar.permission.requireUserAuthorizedInOrganization(dbParent);

  const isParentDescendant = cluar.organization.isAncestorOf(
    _val.map()
      .set("ancestor", dbOrganization)
      .set("descendant", dbParent)
  );

  if (isParentDescendant) {
    _header.status(409);
    _out.json(
      _val.map()
        .set("result", false)
        .set("error_code", "hierarchy-breakdown")
        .set("error", "An organization cannot have as parent an organization below its hierarchy")
    );
    _exec.stop();
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

_out.json(
  _val.map()
    .set("result", true)
);
