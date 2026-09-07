import { _db, _val, _out, _exec, _user, _req } from "@netuno/server-types";

const peopleUid = _req.getString("uid");

const dbPeople = _db.queryFirst(`
    SELECT * FROM people WHERE uid = ?::uuid 
`, peopleUid);

if (dbPeople) {
  const peopleId = dbPeople.getInt("id")
  _db.execute(`DELETE from organization_people WHERE people_id = ${peopleId}`);
  _db.delete(
    "people",
    peopleId
  );
  _user.remove(dbPeople.getInt("people_user_id"));
  _out.json(
    _val.map()
      .set("result", true)
  );
} else {
  _out.output(404);
  _out.json(
    _val.map()
      .set("error", "not-exist")
  );
}
