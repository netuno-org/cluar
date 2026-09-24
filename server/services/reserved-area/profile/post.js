import { _db, _val, _req, _user, _group, _auth, _altcha, _remote } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const name = _req.getString("name");
const username = _req.getString("username");
let email = _req.getString("email");
const password = _req.getString("password");
const code = _req.getString("code");
const provider = _req.getString("provider");
const altchaPayload = _req.getString("altcha");

const noPass = code != "" && provider != "" && password == "" && email == "";

let avatar = "";

if (noPass) {
  const dbProviderUser = _user.providerDataByUid(code);
  if (dbProviderUser == null || dbProviderUser.getString("provider_code") !== provider) {
    cluar.response.error({
      status: 409,
      error: "invalid provider data",
      error_code: "invalid-provider-data"
    });
  }
  email = dbProviderUser.getString("email");
  const urlAvatar = dbProviderUser.getString("avatar");
  if (urlAvatar !== "") {
    const responseAvatar = _remote.init().asBinary().get(urlAvatar);
    if (responseAvatar.ok()) {
      avatar = responseAvatar.file();
      avatar.rename("avatar.png");
    }
  } else if (_auth.altchaEnabled() && !_altcha.verifySolution(altchaPayload)) {
    cluar.response.error({
      status: 409,
      error: "invalid altcha payload",
      error_code: "invalid-altcha-payload"
    });
  }
}

const userEmailExists = _user.firstByMail(email);
const usernameExists = _user.firstByUser(username);

if (userEmailExists || usernameExists) {
  cluar.response.error({
    status: 409,
    error: userEmailExists ? "email already exists" : "username already exists",
    error_code: userEmailExists ? "email-already-exists" : "user-already-exists"
  });
}

const dbGroup = _group.firstByCode("profile");

const userData = _val.map()
  .set("name", name)
  .set("user", username)
  .set("pass", password)
  .set("no_pass", noPass)
  .set("mail", email)
  .set("active", true)
  .set("group_id", dbGroup.getInt("id"));

const user_id = _user.create(userData);

_db.insertIfNotExists(
  "profile",
  _val.map()
    .set("name", name)
    .set("email", email)
    .set("profile_user_id", user_id)
    .set("avatar", avatar)
);

cluar.response.successWithoutData({ status: 200 });
