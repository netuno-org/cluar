import { _db, _val, _req, _out, _header, _exec, _storage, _template, _crypto, _smtp, _time, _uid } from "@netuno/server-types";

const mail = _req.getString("mail");
const currentLanguageCode = _req.getString("current_language");

const dbProfile = _db.findFirst(
  "profile",
  _val.map()
    .set(
      "where",
      _val.map()
        .set("email", mail)
    )
);

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

if (dbProfile != null && dbProfile.getBoolean("active")) {
  const recoveryKey = _crypto.sha512(_uid.generate());
  const recoveryLimit = _time.localDateTime().plusDays(1);
  _db.update(
    "profile",
    dbProfile.getInt("id"),
    _val.map()
      .set("recovery_key", recoveryKey)
      .set("recovery_limit", _db.timestamp(recoveryLimit))
  );
  dbProfile.set("recovery_key", recoveryKey);
  dbProfile.set("recovery_link", `${_header.getString("Origin")}/recovery#${recoveryKey}`);

  const smtp = _smtp.init();
  smtp.to = dbProfile.getString("email");
  smtp.text = `
   
  `;
  const translations = _db.form('translation')
    .link(
      'translation_entry',
      _db.where('code').in('recovery-mail-message', 'recovery-mail-subject')
    )
    .where(
      _db.where('language_id').equals(dbLanguage.getInt("id"))
    )
    .get('translation.value')
    .get('translation_entry.code')
    .all();

  const subject = translations.find((translation) => translation.getString('code') === "recovery-mail-subject").getString('value') || "";
  let content = translations.find((translation) => translation.getString('code') === "recovery-mail-message").getString('value') || "";
  content = content.replace('${name}', dbProfile.getString('name'));
  content = content.replace('${link}', dbProfile.getString('recovery_link'));

  smtp.subject = subject;
  smtp.html = _template.getOutput(
    "email/recovery-mail", _val.map()
      .set('content', content)
  );
  smtp.attachment(
    "logo.png",
    "image/png",
    _storage.filesystem("server", "images", "logo.png").file(),
    "logo"
  );
  smtp.send();
  _out.json(
    _val.map().set("result", true)
  );
} else if (dbProfile != null && !dbProfile.getBoolean("active")) {
  _header.status(409);
  _out.json(
    _val.map()
      .set("error", "user-not-active")
  );
} else {
  _header.status(404);
  _out.json(
    _val.map()
      .set("error", "not-exists")
  );
}
