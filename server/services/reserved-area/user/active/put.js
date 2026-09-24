import { _db, _val, _req, _out, _user } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const uid = _req.getString("uid");
const active = _req.getBoolean("active");

const dbProfile = _db.queryFirst(`
    SELECT id, profile_user_id FROM profile WHERE uid = ?::uuid
`, uid);

if (!dbProfile) {
  cluar.response.error({
    status: 404,
    error: `user not found with uid: ${uid}`,
    error_code: "user-not-found"
  });
}

_user.update(
  dbProfile.getInt("profile_user_id"),
  _val.map()
    .set("active", active),
  false
);

_db.update(
  "profile",
  dbProfile.getInt("id"),
  _val.map()
    .set("active", active)
);

_out.json(
  _val.map()
    .set("result", true)
);
