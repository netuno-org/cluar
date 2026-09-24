import { _db, _val, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const uid = _req.getString("uid");
const value = _req.getString("value");
const languageCode = _req.getString("language_code");
const entryCode = _req.getString("entry_code");

const dbTranslation = _db.get("translation", uid);

if (!dbTranslation) {
  cluar.response.error({
    status: 404,
    error: `translation not found with uid: ${uid}`,
    error_code: "translation-not-found"
  });
}


const dbLanguage = _db.queryFirst(`
    SELECT id, code, description FROM language WHERE code = ?
`, languageCode);

if (!dbLanguage) {
  cluar.response.error({
    status: 404,
    error: `language not found with code: ${languageCode}`,
    error_code: "language-not-found"
  });
}

const dbEntry = _db.queryFirst(`
    SELECT id, code, description FROM translation_entry WHERE code = ?
`, entryCode);

if (!dbEntry) {
  cluar.response.error({
    status: 404,
    error: `entry not found with code: ${entryCode}`,
    error_code: "entry-not-found"
  });
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

cluar.response.successWithoutData({ status: 200 });
