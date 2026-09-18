import { _req, _val, _header, _out, _exec, _db, _user } from "@netuno/server-types";

const dbProfile = _db.form('profile')
  .where(
    _db.where('profile_user_id').equals(_user.id())
  ).first()

if (!dbProfile) {
  _header.status(404)
  _exec.stop()
}

const groups = _db.form("organization_profile")
  .where(
    _db.where("profile_id").equals(dbProfile.getInt("id"))
      .and(_db.where("active").equals(true))
  )
  .link("user_group")
  .get("user_group.name")
  .get("user_group.code")
  .get("user_group.uid")
  .all();

const data = _val.map()
  .set("uid", dbProfile.getString("uid"))
  .set("name", dbProfile.getString("name"))
  .set("email", dbProfile.getString("email"))
  .set("username", _user.get(_user.id()).getString("user"))
  .set("avatar", dbProfile.getString("avatar") != '')
  .set("groups", groups)

_out.json(
  _val.map()
    .set("result", true)
    .set("data", data)
);
