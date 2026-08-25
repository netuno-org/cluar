const uid = _req.getString("uid");

const dbDictionary = _db.get('dictionary', uid);

if (!dbDictionary) {
    _header.status(404);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error', `dictionary not found with uid: ${uid}`)
            .set('error_code', `dictionary-not-found`)
    );
    _exec.stop();
}

const dbLanguage = _db.get("language", dbDictionary.getInt("language_id"));
const dbEntry = _db.get("dictionary_entry", dbDictionary.getInt("entry_id"));

_out.json(
    _val.map()
        .set('result', true)
        .set('dictionary', _val.map()
            .set('uid', dbDictionary.getString("uid"))
            .set('value', dbDictionary.getString("value"))
            .set('language', _val.map()
                .set('code', dbLanguage.getString('code'))
                .set('description', dbLanguage.getString('description'))
            )
            .set('entry', _val.map()
                .set('code', dbEntry.getString('code'))
                .set('description', dbEntry.getString('description'))
            )
        )
)
