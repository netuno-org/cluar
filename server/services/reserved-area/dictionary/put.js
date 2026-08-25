const uid = _req.getString("uid");
const value = _req.getString("value");
const languageCode = _req.getString("language_code");
const entryCode = _req.getString("entry_code");

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


const dbLanguage = _db.queryFirst(`
    SELECT id, code, description FROM language WHERE code = ?
`, languageCode);

if (!dbLanguage) {
    _header.status(404);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error', `language not found with code: ${languageCode}`)
            .set('error_code', `language-not-found`)
    );
    _exec.stop();
}

const dbEntry = _db.queryFirst(`
    SELECT id, code, description FROM dictionary_entry WHERE code = ?
`, entryCode);

if (!dbEntry) {
    _header.status(404);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error', `entry not found with code: ${entryCode}`)
            .set('error_code', `entry-not-found`)
    );
    _exec.stop();
}

const data = _val.map()
    .set('value', value)
    .set('language_id', dbLanguage.getInt("id"))
    .set('entry_id', dbEntry.getInt("id"))

_db.update(
    'dictionary', 
    dbDictionary.getInt("id"),
    data
)

_out.json(
    _val.map()
        .set('result', true)
)