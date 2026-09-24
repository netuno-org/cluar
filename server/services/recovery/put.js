import { _db, _req, _user } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const dbProfile = _db.queryFirst(`
    SELECT * 
    FROM profile
    WHERE recovery_key = ?
      AND recovery_limit >= CURRENT_TIMESTAMP
  `, _req.getString("key"));

if (dbProfile != null) {
  const userData = _user.get(dbProfile.getInt("profile_user_id"));
  userData.set("no_pass", false);
  userData.set("pass", _req.getString("password"));
  _user.update(userData, true);
  cluar.response.successWithoutData({ status: 200 });
} else {
  cluar.response.error({
    status: 404,
    error: "user not found",
    error_code: "user-not-found"
  });
}
