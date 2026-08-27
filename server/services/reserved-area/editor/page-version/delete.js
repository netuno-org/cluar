import { _db, _val, _req, _out } from "@netuno/server-types";
import cluar from "#core/cluar/main.js"

const pageVersion = _req.getString("uid");

const dbPageVersion = _db.get("page_version", pageVersion);

if (pageVersion) {
  cluar.db.cascadeDeletePageVersion(dbPageVersion.getInt("id"));
  _out.json(_val.map().set("result", true));
} else {
  _out.json(_val.map().set("result", false).set("error", "not-found"));
}
