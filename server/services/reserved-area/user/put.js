import { _db, _val, _req, _out, _header, _exec, _user, _group } from "@netuno/server-types";

const uid = _req.getString("uid");
const name = _req.getString("name");
const username = _req.getString("username");
let email = _req.getString("email");
const password = _req.getString("password");

const userEmailExists = _user.firstByMail(email);
const usernameExists = _user.firstByUser(username);

const dbProfile = _db.get("profile", uid);

if (!dbProfile) {
  _header.status(404);
  _out.json(
    _val.map()
      .set("result", false)
      .set("error", `user not found with uid: ${uid}`)
      .set("error-code", "user-not-found")
  );
  _exec.stop();
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
  _header.status(409);
  _out.json(
    _val.map()
      .set("result", false)
      .set("error", "email or username already exists")
      .set("error-code", "user-exists")
  );
  _exec.stop();
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

_out.json(
  _val.map()
    .set("result", true)
);

