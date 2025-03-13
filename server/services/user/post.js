//_core: db/insertAndReturn

const name = _req.getString("name");
const username = _req.getString("username");
let email = _req.getString("email");
const password = _req.getString("password");
const groupCode = _req.getString("group_code");
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
  