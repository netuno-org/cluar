import { _db, _val, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const pageUid = _req.getString("page");
const pageVersionUid = _req.getString("page_version");

const dbPage = _db.get("page", pageUid);
if (!dbPage) {
  cluar.response.error({ status: 404, error: "page not found", error_code: "page-not-found" });
}
const pageId = dbPage.getInt("id");

cluar.permission.requireUserAuthorizedToEditPage(dbPage.getInt("id"));

const publishedStatusId = _db.queryFirst(`
    SELECT *
    FROM page_status
    WHERE code = 'published'
`).getInt("id");

const draftStatusId = _db.queryFirst(`
    SELECT *
    FROM page_status
    WHERE code = 'draft'
`).getInt("id");

const dbPageVersion = _db.get("page_version", pageVersionUid);
if (!dbPageVersion) {
  cluar.response.error({
    status: 409,
    error: "invalid page version uid",
    error_code: "invalid-page-version-uid"
  });
}

const dbCurrentPageVersion = _db.queryFirst(`
    SELECT *
    FROM page_version
    WHERE 1 = 1
        AND page_id = ${_db.param("int")}
        AND status_id = ${_db.param("int")} 
  `, pageId, publishedStatusId);

if (!dbCurrentPageVersion) {
  cluar.response.error({
    status: 409,
    error: "page has no published version",
    error_code: "page-has-no-published-version"
  });
}

// Coloca versão atual em rascunho
_db.update(
  "page_version",
  dbCurrentPageVersion.getInt("id"),
  _val.map()
    .set("status_id", draftStatusId)
);

// Coloca a nova versão publicada
_db.update(
  "page_version",
  dbPageVersion.getInt("id"),
  _val.map()
    .set("status_id", publishedStatusId)
);

cluar.response.successWithoutData({ status: 200 });
