import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";

const uid = _req.getString("uid");
const value = _req.getString("value");
const languageCode = _req.getString("language_code");
const entryCode = _req.getString("entry_code");

const dbTranslation = _db.get("translation", uid);

if (!dbTranslation) {
  _header.status(404);
  _out.json(
    _val.map()
      .set("result", false)
      .set("error", `translation not found with uid: ${uid}`)
      .set("error_code", "translation-not-found")
  );
  _exec.stop();
}


const dbLanguage = _db.queryFirst(`
    SELECT id, code, description FROM language WHERE code = ?
`, languageCode);

if (!dbLanguage) {
  _header.status(404);
  _out.json(
    _val.map()
      .set("result", false)
      .set("error", `language not found with code: ${languageCode}`)
      .set("error_code", "language-not-found")
  );
  _exec.stop();
}

const dbEntry = _db.queryFirst(`
    SELECT id, code, description FROM translation_entry WHERE code = ?
`, entryCode);

if (!dbEntry) {
  _header.status(404);
  _out.json(
    _val.map()
      .set("result", false)
      .set("error", `entry not found with code: ${entryCode}`)
      .set("error_code", "entry-not-found")
  );
  _exec.stop();
}

const data = _val.map()
  .set("value", value)
  .set("language_id", dbLanguage.getInt("id"))
  .set("entry_id", dbEntry.getInt("id"));

_db.update(
  "translation",
  dbTranslation.getInt("id"),
  data
);

_out.json(
  _val.map()
    .set("result", true)
);
