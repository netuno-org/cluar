import { _db, _val, _req, _out } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const uid = _req.getString("uid");
const description = _req.getString("description");
const code = _req.getString("code");
const locale = _req.getString("locale");
const active = _req.getBoolean("active");
const isDefault = _req.getBoolean("default");

const dbLanguage = _db.queryFirst(`
    SELECT id FROM language WHERE uid = ?::uuid  
`, uid);

if (!dbLanguage) {
  cluar.response.error({
    status: 404,
    error: `language not found with uid: ${uid}`,
    error_code: "language-not-found"
  });
}

const languageExists = _db.queryFirst(`
    SELECT 
        CASE WHEN COUNT(1) > 0 THEN TRUE ELSE FALSE END AS result     
    FROM language
    WHERE 1 = 1
        AND (code = ? OR locale = ?)
        AND id != ?
`, code, locale, dbLanguage.getInt("id")).getBoolean("result");

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

_db.update(
  "language",
  dbLanguage.getInt("id"),
  data
);

_out.json(
  _val.map()
    .set("result", true)
);
