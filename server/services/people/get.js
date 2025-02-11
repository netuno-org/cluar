const dbPeople = _db.form('people')
  .where(
    _db.where('people_user_id').equal(_user.id)
  ).first()

if (!dbPeople) {
  _header.status(404)
  _exec.stop()
}

const data = _val.map()
  .set("uid", dbPeople.getString("uid"))
  .set("name", dbPeople.getString("name"))
  .set("email", dbPeople.getString("email"))
  .set("username", _user.get(_user.id()).getString("user"))
  .set("avatar", dbPeople.getString("avatar") != '')
  .set("group", _group.code())

_out.json(
  _val.map()
    .set("result", true)
    .set("data", data)
);