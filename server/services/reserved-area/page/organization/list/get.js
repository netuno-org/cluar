import { _db, _val, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const pageUid = _req.getString("page_uid");

const dbPage = _db.get("page", pageUid);

if (!dbPage) {
  cluar.response.error({
    status: 404,
    error: `page not found with uid: ${pageUid}`,
    error_code: "page-not-found"
  });
}

cluar.permission.requireUserAuthorizedInAnyOrganizationOfPage(dbPage.getInt("id"));

const organizations = _val.list();

for (const dbOrganization of cluar.page.getOrganizations(dbPage.getInt("id"))) {
  organizations.add(
    _val.map()
      .set("uid", dbOrganization.getString("uid"))
      .set("name", dbOrganization.getString("name"))
      .set("code", dbOrganization.getString("code"))
  );
}

cluar.response.successWithData({
  status: 200,
  data: organizations
});