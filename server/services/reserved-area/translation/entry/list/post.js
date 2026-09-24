import { _db, _val } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const dbEntries = _db.form("translation_entry")
  .get("uid")
  .get("description")
  .get("code")
  .all();

cluar.response.successWithData({
  status: 200,
  data: dbEntries
});
