const name = _req.getString('name')
const email = _req.getString('email')
const subject = _req.getString('subject')
const message = _req.getString('message')
const recaptchaValue = _req.get('recaptchaValue')

const recaptchaURL = _app.settings.getValues("recaptcha").getString("url")
const recaptchaSecretKey = _app.settings.getValues("recaptcha").getString("secret_key")

const remoteRecaptcha = _remote.init("recaptcha")
remoteRecaptcha.setURLPrefix(
    `${recaptchaURL}?secret=${recaptchaSecretKey}&response=${recaptchaValue}`
);
const responseRecaptcha = remoteRecaptcha.post()
const responseRecaptchaJSON = responseRecaptcha.json()

if (responseRecaptchaJSON.get("success")) {

    const contactData = _val.map()
        .set('name', name)
        .set('email', email)
        .set('subject', subject)
        .set('message', message)
        .set('moment', _db.timestamp())

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

    const smtp = _smtp.init();

    smtp.to(dbRecipient.getString("email"));
    smtp.subject = 'Você recebeu um novo pedido de contacto em cluarwebsite.com';
    smtp.html = _template.getOutput('email/contact_alert', contactData);

    smtp.attachment(
        "logo.png",
        "image/png",
        _app.file("public/images/logo.png"),
        "logo"
    );

    smtp.send();

    _out.json(
        _val.map()
            .set('result', true)
    )

} else {
    _out.json(
        _val.map()
            .set('result', false)
    )
}