// _core: db/insertAndReturn

const value = _req.getString("value");
const languageCode = _req.getString("language_code");
const entryCode = _req.getString("entry_code");

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

const dbDictionary = insertAndReturn('dictionary', data);

_header.status(201);
_out.json(
    _val.map()
        .set('result', true)
        .set('dictionary', _val.map()
            .set('uid', dbDictionary.getString("uid"))
            .set('value', dbDictionary.getString('value'))
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