const dbPeople = _db.queryFirst(`
    SELECT * 
    FROM people
    WHERE recovery_key = ?
      AND recovery_limit >= CURRENT_TIMESTAMP
  `, _req.getString("key"))
  
  if (dbPeople != null) {
    const userData = _user.get(dbPeople.getInt("people_user_id"))
    userData.set("no_pass", false)
    userData.set("pass", _req.getString("password"))
    _user.update(userData, true);
    _out.json(
      _val.map()
        .set("result", true)
    )
  } else {
    _header.status(404)
    _out.json(
      _val.map()
        .set("error", "user-not-found")
    )
  }