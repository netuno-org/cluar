const name = _req.getString('name')
const email = _req.getString('email')
const subject = _req.getString('subject')
const message = _req.getString('message')
const recaptchaValue = _req.get('recaptchaValue')

let recaptchaURL = ""
let recaptchaSecretKey = ""

if (_app.settings.getValues("recaptcha")) {
    recaptchaURL = _app.settings.getValues("recaptcha").getString("url")
    recaptchaSecretKey = _app.settings.getValues("recaptcha").getString("secret_key")
}

function addContact(){
    _db.insert(
        'contact',
        _val.map()
            .set('name', name)
            .set('email', email)
            .set('subject', subject)
            .set('message', message)
            .set('moment', _db.timestamp())
    )

    _out.json(
        _val.map()
            .set('result', true)
    )
}

if (recaptchaURL && recaptchaSecretKey) {
    const remoteRecaptcha = _remote.init("recaptcha")
    remoteRecaptcha.setURLPrefix(
        `${recaptchaURL}?secret=${recaptchaSecretKey}&response=${recaptchaValue}`
    );
    const responseRecaptcha = remoteRecaptcha.post()
    const responseRecaptchaJSON = responseRecaptcha.json()
    
    if (responseRecaptchaJSON.get("success")) {
        addContact()
    } else {
        _out.json(
            _val.map()
                .set('result', false)
        )
    }
} else {
    addContact()
}