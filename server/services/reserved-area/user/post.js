import { _req, _db, _val, _user, _group } from "@netuno/server-types";
import cluar from "#core/cluar/main.js"

const name = _req.getString("name");
const username = _req.getString("username");
let email = _req.getString("email");
const password = _req.getString("password");
const groupCode = _req.getString("group_code");
const organizationcode = _req.getString("organization_code")
const active = _req.getBoolean("active");

const userEmailExists = _user.firstByMail(email);
const usernameExists = _user.firstByUser(username);

if (userEmailExists || usernameExists) {
  cluar.response.error({
    status: 409,
    error: userEmailExists ? "email already exists" : "username already exists",
    error_code: userEmailExists ? "email-already-exists" : "user-already-exists"
  });
}

const dbOrganization = _db.queryFirst("SELECT id, name, code FROM organization WHERE code = ?::varchar", organizationcode);

if (!dbOrganization) {
  cluar.response.error({
    status: 404,
    error: `organization not found with code: ${organizationcode}`,
    error_code: "organization-not-found"
  });
}

const dbGroup = _db.queryFirst("SELECT id, name, code FROM user_group WHERE code = ?::varchar", groupCode);

if (!dbGroup) {
  cluar.response.error({
    status: 404,
    error: `group not found with code: ${groupCode}`,
    error_code: "group-not-found"
  });
}

cluar.permission.requireUserAuthorizedInOrganization(dbOrganization);

const userData = _val.map()
  .set("name", name)
  .set("active", active)
  .set("user", username)
  .set("pass", password)
  .set("mail", email)
  .set("group_id", _group.firstByCode("profile").getInt("id"))

const profileData = _val.map()
  .set("name", name)
  .set("active", active)
  .set("email", email)

const userId = _user.create(userData);
profileData.set("profile_user_id", userId);


const registedProfile = cluar.db.insertAndReturn("profile", profileData);
const registedUser = _user.get(userId);

_db.insert(
  "organization_profile",
  _val.map()
    .set("profile_id", registedProfile.getInt("id"))
    .set("organization_id", dbOrganization.getInt("id"))
    .set("user_group_id", dbGroup.getInt("id"))
)

cluar.response.successWithData({
  status: 201,
  data: _val.map()
    .set("name", registedProfile.getString("name"))
    .set("email", registedProfile.getString("email"))
    .set("active", registedUser.getBoolean("active"))
    .set("uid", registedProfile.getString("uid"))
    .set("username", registedUser.getString("user"))
});

