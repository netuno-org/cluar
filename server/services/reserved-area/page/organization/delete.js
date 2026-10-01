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
    SELECT id, uid, code FROM organization WHERE uid = ?::uuid
`, organizationUid);

if (!dbOrganization) {
  cluar.response.error({
    status: 404,
    error: `organization not found with uid: ${organizationUid}`,
    error_code: "organization-not-found"
  });
}

cluar.permission.requireUserAuthorizedInAnyOrganizationOfPage(dbPage.getInt("id"));
cluar.permission.requireUserAuthorizedInOrganization(dbOrganization);

const dbPageOrganization = cluar.page.getOrganizationLink(
  dbPage.getInt("id"),
  dbOrganization.getInt("id")
);

if (!dbPageOrganization) {
  cluar.response.error({
    status: 404,
    error: `page is not associated with the organization: ${dbOrganization.getString("code")}`,
    error_code: "page-organization-not-found"
  });
}

let dbReassignedOrganization = null;

/*
 * A page must always belong to at least one organization, otherwise its
 * children have no organization to inherit from. Removing the last one hands
 * the page over to an organization of the user performing the removal that is
 * an ancestor of the organization being removed, so the page never jumps to an
 * unrelated branch of the hierarchy.
 */
if (cluar.page.countOrganizations(dbPage.getInt("id")) <= 1) {
  dbReassignedOrganization = cluar.user.getAdministratorOrganization(dbOrganization.getInt("id"));

  if (!dbReassignedOrganization) {
    cluar.response.error({
      status: 409,
      error: "cannot remove the organization, the page would be left without any and the user has no ancestor organization to assign it to",
      error_code: "page-needs-at-least-one-organization"
    });
  }
}

_db.delete("page_organization", dbPageOrganization.getInt("id"));

if (dbReassignedOrganization) {
  cluar.db.insertAndReturn("page_organization", _val.map()
    .set("page_id", dbPage.getInt("id"))
    .set("organization_id", dbReassignedOrganization.getInt("id")));
}

const data = _val.map().set("reassigned", dbReassignedOrganization !== null);

if (dbReassignedOrganization) {
  data.set("organization", _val.map()
    .set("uid", dbReassignedOrganization.getString("uid"))
    .set("name", dbReassignedOrganization.getString("name"))
    .set("code", dbReassignedOrganization.getString("code")));
}

cluar.response.successWithData({
  status: 200,
  data
});