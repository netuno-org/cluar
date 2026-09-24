import { _db, _val, _req, _out, _header } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const description = _req.getString("description");
const code = _req.getString("code");
const locale = _req.getString("locale");
const active = _req.getBoolean("active");
const isDefault = _req.getBoolean("default");

const languageExists = _db.queryFirst(`
    SELECT 
        CASE WHEN COUNT(1) > 0 THEN TRUE ELSE FALSE END AS result     
    FROM language
    WHERE 1 = 1
        AND (code = ? OR locale = ?)
`, code, locale).getBoolean("result");

if (languageExists) {
  cluar.response.error({
    status: 409,
    error: "language already exists with this code or locale",
    error_code: "language-exists"
  });
}

const data = _val.map()
  .set("description", description)
  .set("code", code)
  .set("locale", locale)
  .set("default", isDefault)
  .set("active", active);


const registedLanguage = cluar.db.insertAndReturn("language", data);

_header.status(201);
_out.json(
  _val.map()
    .set("result", true)
    .set("language", _val.map()
      .set("uid", registedLanguage.getString("uid"))
      .set("active", registedLanguage.getBoolean("active"))
      .set("description", registedLanguage.getString("description"))
      .set("code", registedLanguage.getString("code"))
      .set("locale", registedLanguage.getString("locale"))
    )
);
