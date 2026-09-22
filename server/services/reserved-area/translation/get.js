import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";

const uid = _req.getString("uid");

const dbTranslation = _db.get('translation', uid);

if (!dbTranslation) {
  _header.status(404);
  _out.json(
    _val.map()
      .set('result', false)
      .set('error', `translation not found with uid: ${uid}`)
      .set('error_code', `translation-not-found`)
  );
  _exec.stop();
}

const dbLanguage = _db.get("language", dbTranslation.getInt("language_id"));
const dbEntry = _db.get("translation_entry", dbTranslation.getInt("entry_id"));

_out.json(
  _val.map()
    .set('result', true)
    .set('translation', _val.map()
      .set('uid', dbTranslation.getString("uid"))
      .set('value', dbTranslation.getString("value"))
      .set('language', _val.map()
        .set('code', dbLanguage.getString('code'))
        .set('description', dbLanguage.getString('description'))
      )
      .set('entry', _val.map()
        .set('code', dbEntry.getString('code'))
        .set('description', dbEntry.getString('description'))
      )
    )
);
