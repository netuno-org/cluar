const dbPeople = _db.queryFirst(`
    SELECT *
    FROM people
    WHERE people_user_id = ${_db.param("int")}
  `, _user.id)
  
  if (!dbPeople) {
    _auth.signInAbortWithData(
      _val.map()
        .set('error', 'invalid-user')
    )
    _exec.stop()
  }

const authorizedGroups = ['administrator']

const isAuthorized = _db.queryFirst(`
  SELECT 1
  FROM organization_people
  WHERE 1 = 1
    AND people_id = ${dbPeople.getInt("id")}
    AND user_group_id IN (
      SELECT id FROM user_group WHERE code IN (
        ${authorizedGroups.map((group) => `'${group}'`).join(", ")}
      )
    )
    AND active = true
`);


if (!isAuthorized) {
  _auth.signInAbortWithData(
    _val.map()
      .set('result', false)
      .set('error', 'user unauthorized')
      .set('error_code', 'user-unauthorized')
  )
  _exec.stop()
}

const data = _val.map()
    .set("uid", dbPeople.getString("uid"))
    .set("name", dbPeople.getString("name"))
    .set("email", dbPeople.getString("email"))
    .set("username", _user.get(_user.id()).getString("user"))
    .set("avatar", dbPeople.getString("avatar") != '')
    .set("group", _group.code())

_auth.signInExtraData(data)