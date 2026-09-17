import { _db, _val, _out, _exec, _user } from "@netuno/server-types";

/**
 *  This is a sample of the user account removal.                                                           
 *  Comment or delete the line below to allow this service execution. 
 */

_exec.stop();

/** * **/

const dbProfile = _db.queryFirst(`
    SELECT * FROM profile WHERE profile_user_id = ${_db.param("int")}
`, _user.id);

if (dbProfile) {
  const profileId = dbProfile.getInt("id")
  _db.execute(`DELETE from organization_profile WHERE profile_id = ${profileId}`);
  _db.delete(
    "profile",
    profileId
  );
  _user.remove(dbProfile.getInt("profile_user_id"));
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
