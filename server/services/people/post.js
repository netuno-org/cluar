const name = _req.getString("name")
const username = _req.getString("username")
let email = _req.getString("email")
const password = _req.getString("password")
const code = _req.getString("code")
const provider = _req.getString("provider")

const noPass = code != '' && provider != '' && password == '' && email == ''

let avatar = ''

if (noPass) {
  const dbProviderUser = _user.providerDataByUid(code)
  if (dbProviderUser == null || dbProviderUser.getString('provider_code') != provider) {
    _header.status(409)
    _out.json(
      _val.map()
        .set("error", `invalid-provider-data`)
    )
    _exec.stop()
  }
  email = dbProviderUser.getString('email')
  const urlAvatar = dbProviderUser.getString('avatar')
  if (urlAvatar !== '') {
    const responseAvatar = _remote.init().asBinary().get(urlAvatar)
    if (responseAvatar.ok()) {
      avatar = responseAvatar.file()
      avatar.rename("avatar.png")
    }
  }
}

const userEmailExists = _user.firstByMail(email)
const usernameExists = _user.firstByUser(username)

if (userEmailExists || usernameExists) {
  _header.status(409)
  _out.json(
    _val.map()
      .set("error", `${userEmailExists ? 'email' : 'user'}-already-exists`)
  )
  _exec.stop()
}

const dbGroup = _group.firstByCode("people")

const userData = _val.map()
      .set("name", name)
      .set("user", username)
      .set("pass", password)
      .set("no_pass", noPass)
      .set("mail", email)
      .set("active", true)
      .set("group_id", dbGroup.getInt("id"))

const user_id = _user.create(userData)

_db.insertIfNotExists(
  'people',
  _val.map()
    .set("name", name)
    .set("email", email)
    .set("people_user_id", user_id)
    .set("avatar", avatar)
)

_out.json(
  _val.map()
    .set("result", true)
)