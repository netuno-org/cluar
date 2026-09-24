import { _db, _user, _auth, _val, _exec, _group } from "@netuno/server-types";
import groups from "#core/consts/group.js";

const dbProfile = _db.queryFirst(`
    SELECT *
    FROM profile
    WHERE profile_user_id = ?
`, _user.id);

if (!dbProfile) {
  _auth.signInAbortWithData(
    _val.map()
      .set("result", false)
      .set("error", "invalid user")
      .set("error_code", "invalid-user")
  );
  _exec.stop();
}

const authorizedGroups = [groups["ADMIN"], groups["EDITOR"]];

const isAuthorized = _db.queryFirst(`
    SELECT 1
    FROM organization_profile
    WHERE 1 = 1
        AND profile_id = ${_db.param("int")}
        AND user_group_id IN (
            SELECT id FROM user_group WHERE code IN (
                ${authorizedGroups.map(() => "?").join(", ")}
            )
        )
        AND active = true
`, dbProfile.getInt("id"), ...authorizedGroups);

if (!isAuthorized) {
  _auth.signInAbortWithData(
    _val.map()
      .set("result", false)
      .set("error", "user unauthorized")
      .set("error_code", "user-unauthorized")
  );
  _exec.stop();
}

const data = _val.map()
  .set("uid", dbProfile.getString("uid"))
  .set("name", dbProfile.getString("name"))
  .set("email", dbProfile.getString("email"))
  .set("username", _user.get(_user.id()).getString("user"))
  .set("avatar", dbProfile.getString("avatar") != "")
  .set("group", _group.code());

_auth.signInExtraData(data);
