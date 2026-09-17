import { _db, _val, _out, _exec, _user, _req } from "@netuno/server-types";

const profileUid = _req.getString("uid");

const dbProfile = _db.queryFirst(`
    SELECT * FROM profile WHERE uid = ?::uuid 
`, profileUid);

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
