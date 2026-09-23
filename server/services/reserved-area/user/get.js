import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";

const uid = _req.getString("uid");

const dbUser = _db.form("profile")
  .join(
    _db.manyToOne(
      "netuno_user",
      "profile_user_id"
    )
  )
  .where(
    _db.where("uid").equal(uid)
  )
  .get("profile.name", "profile_name")
  .get("profile.email", "profile_email")
  .get("profile.uid", "profile_uid")
  .get("netuno_user.active", "user_active")
  .get("netuno_user.user", "username")
  .first();

if (!dbUser) {
  _header.status(404);
  _out.json(
    _val.map()
      .set("result", false)
      .set("error", `user not found with uid: ${uid}`)
      .set("error_code", "user-not-found")
  );
  _exec.stop();
}

const user = _val.map()
  .set("name", dbUser.getString("profile_name"))
  .set("email", dbUser.getString("profile_email"))
  .set("uid", dbUser.getString("profile_uid"))
  .set("active", dbUser.getBoolean("user_active"))
  .set("username", dbUser.getString("username"));

_out.json(
  _val.map()
    .set("result", true)
    .set("user", user)
);
