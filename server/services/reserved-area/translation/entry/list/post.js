import { _db, _val, _out } from "@netuno/server-types";

const dbEntries = _db.form("translation_entry")
  .get("uid")
  .get("description")
  .get("code")
  .all();

_out.json(
  _val.map()
    .set("entries", dbEntries)
    .set("result", true)
);
