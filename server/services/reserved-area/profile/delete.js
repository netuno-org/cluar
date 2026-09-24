import { _db, _out, _exec, _user } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

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
  cluar.response.successWithoutData({ status: 200 });
} else {
  cluar.response.error({
    status: 404,
    error: "profile not found",
    error_code: "profile-not-found"
  });
}
