import { _db, _val, _req, _user, _group } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const uid = _req.getString("uid");
const name = _req.getString("name");
const username = _req.getString("username");
let email = _req.getString("email");
const password = _req.getString("password");

const userEmailExists = _user.firstByMail(email);
const usernameExists = _user.firstByUser(username);

const dbProfile = _db.get("profile", uid);

if (!dbProfile) {
  cluar.response.error({
    status: 404,
    error: `user not found with uid: ${uid}`,
    error_code: "user-not-found"
  });
}

const profileEmailExists = _db.queryFirst(`
    SELECT 
        CASE WHEN COUNT(1) > 0 THEN TRUE ELSE FALSE END AS result
    FROM profile
    WHERE 1 = 1
        AND profile.email = ?
        AND profile.id != ? 
`, email, dbProfile.getInt("id")).getBoolean("result");

const userExists = _db.queryFirst(`
    SELECT
        CASE WHEN COUNT(1) > 0 THEN TRUE ELSE FALSE END AS result
    FROM netuno_user
    WHERE 1 = 1
        AND (netuno_user.user = ? OR netuno_user.mail = ?)
        AND netuno_user.id != ?
`, username, email, dbProfile.getInt("profile_user_id")).getBoolean("result");

if (profileEmailExists || userExists) {
  cluar.response.error({
    status: 409,
    error: "email or username already exists",
    error_code: "user-exists"
  });
}

const userData = _val.map()
  .set("name", name)
  .set("user", username)
  .set("mail", email)
  .set("pass", password)
  .set("group_id", _group.firstByCode("profile").getInt("id"));

let shouldUpdatePass = false;

if (password.length > 1) {
  shouldUpdatePass = true;
}

const profileData = _val.map()
  .set("name", name)
  .set("email", email);

if (_req.has("active")) {
  userData.set("active", _req.getBoolean("active"));
  profileData.set("active", _req.getBoolean("active"));
}

_user.update(
  dbProfile.getInt("profile_user_id"),
  userData,
  shouldUpdatePass
);

_db.update(
  "profile",
  dbProfile.getInt("id"),
  profileData
);

cluar.response.successWithoutData({ status: 200 });

