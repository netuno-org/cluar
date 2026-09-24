import { _val, _db, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js"

const {
  name,
  code,
  parent_code,
  active
} = JSON.parse(_req.toJSON());

let dbParent = null;

if (parent_code) {
  dbParent = _db.queryFirst("SELECT * FROM organization WHERE code = ?", parent_code);
  if (!dbParent) {
    cluar.response.error({
      status: 404,
      error_code: "parent-organization-not-found",
      error: `parent organization not found with code: ${parent_code}`
    });
  }

  cluar.permission.requireUserAuthorizedInOrganization(dbParent);
}

const codeAlreadyInUse = _db.queryFirst(`
    SELECT 1
    FROM organization
    WHERE 1 = 1
        AND code = ?   
`, code);

if (codeAlreadyInUse) {
  cluar.response.error({
    status: 409,
    error_code: "code-already-in-use",
    error: `the code ${code} is already in use by another organization`
  });
}

const insertedOrganization = cluar.db.insertAndReturn(
  "organization",
  _val.map()
    .set("name", name)
    .set("active", active)
    .set("code", code)
    .set("parent_id", dbParent ? dbParent.getInt("id") : 0)
);

const organization = _val.map()
  .set("active", insertedOrganization.getBoolean("active"))
  .set("uid", insertedOrganization.getString("uid"))
  .set("name", insertedOrganization.getString("name"))
  .set("code", insertedOrganization.getString("code"))

if (insertedOrganization.getInt("parent_id") > 0) {
  organization.set("parent", _val.map()
    .set("name", dbParent.getString("name"))
    .set("code", dbParent.getString("code"))
    .set("uid", dbParent.getString("uid"))
  )
}

cluar.response.successWithData({
  status: 201,
  data: organization
})

