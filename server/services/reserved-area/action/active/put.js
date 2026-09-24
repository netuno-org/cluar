import { _db, _val, _req, _out } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const uid = _req.getString("uid");
const active = _req.getBoolean("active");

const dbActions = _db.queryFirst(`
    SELECT
       id
    FROM
        action
    WHERE 1 = 1
        AND uid = ?::uuid
`, uid);

if (!dbActions) {
  cluar.response.error({
    status: 404,
    error: `action not found with uid: ${uid}`,
    error_code: "action-not-found"
  });
}

_db.update(
  "action",
  dbActions.getInt("id"),
  _val.map()
    .set("active", active)
);

_out.json(
  _val.map()
    .set("result", true)
);
