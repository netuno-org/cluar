//_core: db/insertAndReturn
//_core: utils/user

const name = _req.getString("name");
const username = _req.getString("username");
let email = _req.getString("email");
const password = _req.getString("password");
const groupCode = _req.getString("group_code");
const organizationcode = _req.getString('organization_code')
const active = _req.getBoolean("active");

const userEmailExists = _user.firstByMail(email);
const usernameExists = _user.firstByUser(username);

if (userEmailExists || usernameExists) {
  _header.status(409)
  _out.json(
    _val.map()
      .set("error", `${userEmailExists ? 'email' : 'user'}-already-exists`)
  )
  _exec.stop();
}

const dbOrganization = _db.queryFirst(`SELECT id, name, code FROM organization WHERE code = ?::varchar`, organizationcode);

if (!dbOrganization) {
    _header.status(404);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error', `organization not found with uid: ${organizationcode}`)
            .set('error_code', `organization-not-found`)
    );
    _exec.stop();
}

const dbGroup = _db.queryFirst(`SELECT id, name, code FROM user_group WHERE code = ?::varchar`, groupCode);

if (!dbGroup) {
    _header.status(404);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error', `group not found with uid: ${groupCode}`)
            .set('error_code', `group-not-found`)
    );
    _exec.stop();
}

const isAuthorized = isUserAuthorizedInOrganization(
  _val.map()
      .set('organization', dbOrganization)
);

if (!isAuthorized) {
  _header.status(401);
  _out.json(
      _val.map()
          .set('result', false)
          .set('error_code', 'user-unauthorized')
          .set('error', `user not authorized in the organization`)
  )
  _exec.stop();
}

const userData = _val.map()
    .set("name", name)
    .set("active", active)
    .set("user", username)
    .set("pass", password)
    .set("mail", email)
    .set("group_id", _group.firstByCode('people').getInt('id'))

const peopleData = _val.map()
  .set("name", name)
  .set("active", active)
  .set("email", email)

const userId = _user.create(userData);
peopleData.set("people_user_id", userId);


const registedPeople = insertAndReturn("people", peopleData);
const registedUser = _user.get(userId);

_db.insert(
  'organization_people',
  _val.map()
    .set('people_id', registedPeople.getInt('id'))
    .set('organization_id', dbOrganization.getInt('id'))
    .set('user_group_id', dbGroup.getInt('id'))
)

  _header.status(201);
  _out.json(
    _val.map()
      .set("result", true)
      .set("user", _val.map()
        .set('name', registedPeople.getString('name'))
        .set('email', registedPeople.getString('email'))
        .set('active', registedUser.getBoolean('active'))
        .set('uid', registedPeople.getString('uid'))
        .set('username', registedUser.getString('user'))
      )
  )
  