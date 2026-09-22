import { _db, _val, _req, _out, _user, _image } from "@netuno/server-types";

const name = _req.getString("name");
const username = _req.getString("username");
const email = _req.getString("email");
const password = _req.getString("password");
const avatar = _req.getFile("avatar");

const dbProfile = _db.queryFirst(`
  SELECT * FROM profile WHERE profile_user_id = ${_db.param("int")}
`, _user.id());

const userData = _user.get(_user.id());
userData
  .set("name", name)
  .set("user", username)
  .set("mail", email);

if (password.length > 0) {
  userData.set("pass", password);
  _user.update(
    _user.id(),
    userData,
    true
  );
} else {
  _user.update(
    _user.id(),
    userData
  );
}

const profileData = _val.map()
  .set("name", name)
  .set("email", email);

if (avatar) {
  profileData.set(
    "avatar",
    _image
      .init(avatar)
      .resize(500, 500)
      .file(avatar.name(), "jpeg")
  );
}

_db.update(
  "profile",
  dbProfile.getInt("id"),
  profileData
);

_out.json(
  _val.map()
    .set("result", true)
);
