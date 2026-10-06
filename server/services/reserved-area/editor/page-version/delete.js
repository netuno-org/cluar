import { _db, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js"

const pageVersion = _req.getString("uid");

const dbPageVersion = _db.get("page_version", pageVersion);

if (!dbPageVersion) {
  cluar.response.error({
    status: 404,
    error: "page version not found",
    error_code: "page-version-not-found"
  });
}

const pageId = dbPageVersion.getInt("page_id");
cluar.permission.requireUserAuthorizedToEditInAnyOrganizationOfPage(pageId);

cluar.db.cascadeDeletePageVersion(dbPageVersion.getInt("id"));
cluar.response.successWithoutData({ status: 200 });
