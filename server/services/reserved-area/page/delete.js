import { _db, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js"

const pageUid = _req.getString("uid");

const dbPage = _db.get("page", pageUid);

if (!dbPage) {
  cluar.response.error({
    status: 404,
    error: "page not found",
    error_code: "page-not-found"
  });
}

const pageId = dbPage.getInt("id");

const dbPageVersions = _db.query(`
      SELECT * FROM page_version
      WHERE page_id = ?::int
    `, pageId
);

for (const dbPageVersion of dbPageVersions) {
  cluar.db.cascadeDeletePageVersion(dbPageVersion.getInt("id"));
}

_db.execute(`DELETE FROM page_organization WHERE page_id = ${_db.param("int")}`, pageId);

_db.delete("page", pageId);

cluar.response.successWithoutData({ status: 200 });
