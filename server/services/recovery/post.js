const mail = _req.getString("mail");
const currentLanguageCode = _req.getString("current_language");

const dbPeople = _db.findFirst(
  "people",
  _val.map()
    .set(
      "where",
      _val.map()
        .set("email", mail)
    )
)

const dbLanguage = _db.form('language')
.get('id')
.where(
  _db.where('code').equals(currentLanguageCode)
).first();

if (!dbLanguage) {
  _header.status(404);
  _out.json(
    _val.map()
      .set('result', false)
      .set('error', 'language-not-exists')
  );
  _exec.stop();
}

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
  smtp.text = `
   
  `
  const dictionaries = _db.form('dictionary')
  .link(
    'dictionary_entry',
    _db.where('code').in('recovery-mail-message', 'recovery-mail-subject')
  )
  .where(
    _db.where('language_id').equals(dbLanguage.getInt("id"))
  )
  .get('dictionary.value')
  .get('dictionary_entry.code')
  .all();

  const subject = dictionaries.find((dictionary) => dictionary.getString('code') === "recovery-mail-subject").getString('value') || "";
  let content = dictionaries.find((dictionary) => dictionary.getString('code') === "recovery-mail-message").getString('value') || "";
  content = content.replace('${name}', dbPeople.getString('name'));
  content = content.replace('${link}', dbPeople.getString('recovery_link'));

  smtp.subject = subject;
  smtp.html = _template.getOutput(
    "email/recovery-mail", _val.map()
      .set('content', content)
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