const mail = _req.getString("mail")

const dbPeople = _db.findFirst(
  "people",
  _val.map()
    .set(
      "where",
      _val.map()
        .set("email", mail)
    )
)

if (dbPeople != null && dbPeople.getBoolean("active")) {
  const recoveryKey = _crypto.sha512(_uid.generate())
  const recoveryLimit = _time.localDateTime().plusDays(1)
  _db.update(
    "people",
    dbPeople.getInt("id"),
    _val.map()
      .set("recovery_key", recoveryKey)
      .set("recovery_limit", _db.timestamp(recoveryLimit))
  )
  dbPeople.set("recovery_key", recoveryKey);
  dbPeople.set("recovery_link", `${_header.getString("Origin")}/recovery#${recoveryKey}`)

  const smtp = _smtp.init()
  smtp.to = dbPeople.getString("email")
  smtp.subject = `Cluar - Recuperação de password`
  smtp.text = `
    Caro ${dbPeople.getString("name")},

    Para fazer a recuperação da password clique neste link: ${dbPeople.getString("recovery_link")}
    Obrigado,
    netuno.org
  `
  smtp.html = _template.getOutput(
    "email/recovery-mail", dbPeople
  )
  smtp.attachment(
    "logo.png",
    "image/png",
    _storage.filesystem("server", "images", "logo.png").file(),
    "logo"
  )
  smtp.send()
  _out.json(
    _val.map().set("result", true)
  )
} else if (dbPeople != null && !dbPeople.getBoolean("active")) {
  _header.status(409)
  _out.json(
    _val.map()
      .set("error", "user-not-active")
  )
} else {
  _header.status(404)
  _out.json(
    _val.map()
      .set("error", "not-exists")
  )
}