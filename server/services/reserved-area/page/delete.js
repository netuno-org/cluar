import { _db, _val, _req, _out } from "@netuno/server-types";
import cluar from "#core/cluar/main.js"

const pageUid = _req.getString("uid");

const dbPage = _db.get("page", pageUid);

if (dbPage) {
  const pageId = dbPage.getInt("id");

  const dbPageVersions = _db.query(`
      SELECT * FROM page_version
      WHERE page_id = ?::int
    `, pageId
  );

  for (const dbPageVersion of dbPageVersions) {
    cluar.db.cascadeDeletePageVersion(dbPageVersion.getInt("id"));
  }

  _db.delete("page", pageId);

  _out.json(_val.map().set("result", true));
} else {
  _out.json(_val.map().set("result", false).set("error", "not-found"));
}
