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
  
  // _log.info(_req.getString('myparameter'))
  
  const data = _val.map()
        .set("uid", dbPeople.getString("uid"))
        .set("name", dbPeople.getString("name"))
        .set("email", dbPeople.getString("email"))
        .set("username", _user.get(_user.id()).getString("user"))
        .set("avatar", dbPeople.getString("avatar") != '')
        .set("group", _group.code())
  
  _auth.signInExtraData(data)