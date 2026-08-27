import { _db, _val, _out, _exec, _user } from "@netuno/server-types";

/**
 *  This is a sample of the user account remotion.                                                           
 *  Comment or delete the line below to allow this service execution. 
 */

_exec.stop();

/** * **/

const dbPeople = _db.queryFirst(`
    SELECT * FROM people WHERE people_user_id = ${_db.param("int")}
`, _user.id);

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
