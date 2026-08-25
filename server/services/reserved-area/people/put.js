const name = _req.getString("name")
const username = _req.getString("username")
const email = _req.getString("email")
const password = _req.getString("password")
const avatar = _req.getFile("avatar")

const dbPeople = _db.queryFirst(`
  SELECT * FROM people WHERE people_user_id = ${_db.param("int")}
`, _user.id())

const userData = _user.get(_user.id())
userData
  .set("name", name)
  .set("user", username)
  .set("mail", email)

if (password.length > 0) {
  userData.set("pass", password)
  _user.update(
    _user.id(),
    userData,
    true
  )
} else {
  _user.update(
    _user.id(),
    userData
  )
}


const peopleData = _val.map()
      .set("name", name)
      .set("email", email)

if (avatar) {
  peopleData.set(
    "avatar", 
    _image
      .init(avatar)
      .resize(500, 500)
      .file(avatar.name(), "jpeg")
  )
}

_db.update(
  "people",
  dbPeople.getInt("id"),
  peopleData
)

_out.json(
  _val.map()
    .set("result", true)
)