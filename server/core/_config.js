import { _config, _env, _url, _header, _app, _val, _auth, _req, _log } from "@netuno/server-types";

_config.set("_lang", _config.get("_lang:default"));

if (_env.is("dev") && (_url.equals("/") || _url.equals("/Index.netuno"))) {
  _config
    .set("_login:user", "dev")
    .set("_login:pass", "dev")
    .set("_login:auto", _req.getString("action") != "logout");
}

/**
 * DISABLE BROWSER CACHE
 */

if (_url.download.isDownloadable()) {
  if (_env.is("dev") && _url.indexOf("/public/scripts/main.js") > 0) {
    _header.noCache();
  } else {
    _header.cache(2628000);
  }
}

let websiteBuildPath = "";
if (_env.is("dev")) {
  websiteBuildPath = "website/public";
} else {
  websiteBuildPath = "website/dist";
}
if (_app.isFolder(websiteBuildPath)) {
  const websiteConfigFile = _app.file(`${websiteBuildPath}/cluar/settings.js`);
  if (_app.configReloaded() || !websiteConfigFile.exists()) {
    const websiteConfig = _val
      .map()
      .set(
        "config",
        _app.settings
          .getValues("cluar", _val.map())
          .getValues("website", _val.map()),
      )
      .set(
        "auth",
        _val
          .map()
          .set("altcha", _auth.altchaEnabled())
          .set(
            "providers",
            _val
              .map()
              .set("facebook", _auth.providerEnabled("facebook"))
              .set("google", _auth.providerEnabled("google"))
              .set("microsoft", _auth.providerEnabled("microsoft"))
              .set("github", _auth.providerEnabled("github"))
              .set("discord", _auth.providerEnabled("discord")),
          ),
      );

    websiteConfigFile
      .output()
      .printAndClose(`window.cluarSettings = ${websiteConfig.toJSON(4)};`);
  }
} else {
  _log.fatal(
    `Cannot create the settings, because the ${websiteBuildPath} folder does not exist.`,
  );
}
