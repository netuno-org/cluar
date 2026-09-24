import { _db, _val, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const uid = _req.getString("uid");

const dbTranslation = _db.get("translation", uid);

if (!dbTranslation) {
  cluar.response.error({
    status: 404,
    error: `translation not found with uid: ${uid}`,
    error_code: "translation-not-found"
  });
}

const dbLanguage = _db.get("language", dbTranslation.getInt("language_id"));
const dbEntry = _db.get("translation_entry", dbTranslation.getInt("entry_id"));

cluar.response.successWithData({
  status: 200,
  data: _val.map()
    .set("uid", dbTranslation.getString("uid"))
    .set("value", dbTranslation.getString("value"))
    .set("language", _val.map()
      .set("code", dbLanguage.getString("code"))
      .set("description", dbLanguage.getString("description"))
    )
    .set("entry", _val.map()
      .set("code", dbEntry.getString("code"))
      .set("description", dbEntry.getString("description"))
    )
});
