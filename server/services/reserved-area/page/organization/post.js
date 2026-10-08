import { _db, _val, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const pageUid = _req.getString("page_uid");
const organizationUid = _req.getString("organization_uid");

const dbPage = _db.get("page", pageUid);

if (!dbPage) {
  cluar.response.error({
    status: 404,
    error: `page not found with uid: ${pageUid}`,
    error_code: "page-not-found"
  });
}

const dbOrganization = _db.queryFirst(`
    SELECT id, uid, name, code FROM organization WHERE uid = ?::uuid
`, organizationUid);

if (!dbOrganization) {
  cluar.response.error({
    status: 404,
    error: `organization not found with uid: ${organizationUid}`,
    error_code: "organization-not-found"
  });
}

cluar.permission.requireUserAuthorizedToManagePage(dbPage.getInt("id"));
cluar.permission.requireUserAuthorizedInOrganization(dbOrganization.getInt("id"));

const dbPageOrganizationExists = cluar.page.getOrganizationLink(
  dbPage.getInt("id"),
  dbOrganization.getInt("id")
);

if (dbPageOrganizationExists) {
  cluar.response.error({
    status: 409,
    error: `page is already associated with the organization: ${dbOrganization.getString("code")}`,
    error_code: "page-already-in-organization"
  });
}

const dbPageOrganization = cluar.db.insertAndReturn("page_organization", _val.map()
  .set("page_id", dbPage.getInt("id"))
  .set("organization_id", dbOrganization.getInt("id")));

cluar.response.successWithData({
  status: 201,
  data: _val.map()
    .set("uid", dbPageOrganization.getString("uid"))
    .set("page", _val.map()
      .set("uid", dbPage.getString("uid"))
      .set("title", dbPage.getString("title"))
    )
    .set("organization", _val.map()
      .set("uid", dbOrganization.getString("uid"))
      .set("name", dbOrganization.getString("name"))
      .set("code", dbOrganization.getString("code"))
    )
});
