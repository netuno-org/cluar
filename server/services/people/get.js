import { _req, _val, _header, _out, _exec, _db, _user } from "@netuno/server-types";

const dbPeople = _db.form('people')
  .where(
    _db.where('people_user_id').equals(_user.id())
  ).first()

if (!dbPeople) {
  _header.status(404)
  _exec.stop()
}

const groups = _db.form("organization_people")
  .where(
    _db.where("people_id").equals(dbPeople.getInt("id"))
      .and(_db.where("active").equals(true))
  )
  .link(_db.link("organization").where(_db.where("code").equals("admins")))
  .link("user_group")
  .get("user_group.name")
  .get("user_group.code")
  .get("user_group.uid")
  .all();

const data = _val.map()
  .set("uid", dbPeople.getString("uid"))
  .set("name", dbPeople.getString("name"))
  .set("email", dbPeople.getString("email"))
  .set("username", _user.get(_user.id()).getString("user"))
  .set("avatar", dbPeople.getString("avatar") != '')
  .set("groups", groups)

_out.json(
  _val.map()
    .set("result", true)
    .set("data", data)
);