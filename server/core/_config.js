
_config.set("_lang", _config.get("_lang:default"))

if (_env.is("dev")
    && (_url.equals("/") || _url.equals("/Index.netuno"))) {
    _config
        .set("_login:user", "dev")
        .set("_login:pass", "dev")
        .set("_login:auto", _req.getString("action") != "logout")
}

/**
 * DISABLE BROWSER CACHE
 */

if (_url.download.isDownloadable()) {
    if (_env.is("dev") && _url.indexOf("/public/scripts/main.js") > 0) {
        _header.noCache()
    } else {
        _header.cache(2628000)
    }
}

if (_app.configReloaded()) {
    const websiteConfig = _val.map()
        .set("api", _app.settings.getValues("api", _val.map()))
        .set(
            "auth",
            _val.map()
                .set("altcha", _auth.altchaEnabled())
                .set(
                    "providers",
                    _val.map()
                        .set("facebook", _auth.providerEnabled("facebook"))
                        .set("google", _auth.providerEnabled("google"))
                        .set("github", _auth.providerEnabled("github"))
                        .set("discord", _auth.providerEnabled("discord"))
                )
        )
    let websitePath = ""
    if (_env.is("dev")) {
        websitePath = "website/public"
    } else {
        websitePath = "website/dist"
    }
    _app.file(`${websitePath}/reauthkit.js`).output().printAndClose(`window.reauthkit = { config: ${websiteConfig.toJSON(4)} };`)
}
