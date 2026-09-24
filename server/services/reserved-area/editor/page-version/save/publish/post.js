import { _db, _val, _req, _out } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const page = _req.getString("page");
const pageVersion = _req.getString("page_version");

const publishStatus = _db.queryFirst(`
  SELECT *
  FROM page_status
  WHERE code = 'published'
`);
const draftStatus = _db.queryFirst(`
  SELECT *
  FROM page_status
  WHERE code = 'draft'
`);

const dbPageVersion = _db.get("page_version", pageVersion);
if (dbPageVersion) {
  const pageId = dbPageVersion.getInt("page_id");
  const dbCurrentPageVersion = _db.queryFirst(`
    SELECT *
    FROM page_version
    WHERE page_id = ?
      AND status_id = ?
  `, pageId, publishStatus.getInt("id"));

  if (dbCurrentPageVersion) {
    // Colocar versão atual em rascunho
    _db.update(
      "page_version",
      dbCurrentPageVersion.getInt("id"),
      _val.map()
        .set("status_id", draftStatus.getInt("id"))
    );

    // Colocar a nova versão publicada
    _db.update(
      "page_version",
      dbPageVersion.getInt("id"),
      _val.map()
        .set("status_id", publishStatus.getInt("id"))
    );

    _out.json(
      _val.map()
        .set("result", true)
    );
  } else {
    cluar.response.error({
      status: 409,
      error: "page has no publish version",
      error_code: "page-has-no-publish-version"
    });
  }
} else {
  cluar.response.error({
    status: 409,
    error: "page has invalid version",
    error_code: "page-has-invalid-version"
  });
}




