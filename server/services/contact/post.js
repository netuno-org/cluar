import { _db, _val, _req, _remote, _app, _template, _smtp } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const name = _req.getString("name");
const email = _req.getString("email");
const subject = _req.getString("subject");
const message = _req.getString("message");
const recaptchaValue = _req.get("recaptchaValue");
const locale = _req.getString("locale");

const recaptchaURL = _app.settings.getValues("recaptcha").getString("url");
const recaptchaSecretKey = _app.settings.getValues("recaptcha").getString("secret_key");

const remoteRecaptcha = _remote.init("recaptcha");
remoteRecaptcha.setURLPrefix(
  `${recaptchaURL}?secret=${recaptchaSecretKey}&response=${recaptchaValue}`
);
const responseRecaptcha = remoteRecaptcha.post();
const responseRecaptchaJSON = responseRecaptcha.json();

if (responseRecaptchaJSON.get("success")) {

  const contactData = _val.map()
    .set("name", name)
    .set("email", email)
    .set("subject", subject)
    .set("message", message)
    .set("moment", _db.timestamp());

  _db.insert("contact", contactData);

  const dbRecipient = _db.queryFirst(`
            SELECT 
                configuration.value AS "email"
            FROM 
                configuration
            INNER JOIN 
                configuration_parameter ON configuration_parameter.id = configuration.parameter_id
            WHERE 
                configuration_parameter.code = 'contact-notification-recipient'
    `);

  let mailSubject = "Você recebeu um novo pedido de contacto em cluarwebsite.com";

  if (locale) {
    const dbLanguage = _db.form("language")
      .get("id")
      .where(
        _db.where("code").equals(locale)
      ).first();

    if (dbLanguage) {
      const dbTranslation = _db.form("translation")
        .link(
          "translation_entry",
          _db.where("code").in("contact-mail-subject")
        )
        .where(
          _db.where("language_id").equals(dbLanguage.getInt("id"))
        )
        .get("translation.value")
        .first();

      if (dbTranslation) {
        const translationValue = dbTranslation.getString("value");
        if (translationValue) {
          mailSubject = translationValue;
        }
      }
    }
  }

  const smtp = _smtp.init();

  smtp.to(dbRecipient.getString("email"));
  smtp.subject = mailSubject;
  smtp.html = _template.getOutput("email/contact_alert", contactData);

  smtp.attachment(
    "logo.png",
    "image/png",
    _app.file("public/images/logo.png"),
    "logo"
  );

  smtp.send();

  cluar.response.successWithoutData({ status: 200 });

} else {
  cluar.response.error({
    status: 400,
    error_code: "recaptcha-validation-failed",
    error: "recaptcha validation failed"
  });
}
