const uid = _req.getString("uid");
const value = _req.getString("value");
const parameterCode = _req.getString("parameter_code");
const languageCode = _req.getString("language_code");

const dbConfiguration = _db.queryFirst(`
    SELECT id FROM configuration WHERE uid = ?::uuid
`, uid);

if (!dbConfiguration) {
    _header.status(404);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error', `configuration not found with uid: ${uid}`)
            .set('error_code', `configuration-not-found`)
    );
    _exec.stop();
}

const dbParameter = _db.queryFirst(`
    SELECT * FROM configuration_parameter WHERE code = ?
`, parameterCode);

if (!dbParameter) {
    _header.status(404);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error', `parameter not found with code: ${parameterCode}`)
            .set('error_code', `parameter-not-found`)
    );
    _exec.stop();
}

const dbLanguage = _db.queryFirst(`
    SELECT * FROM language WHERE code = ?
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

const data = _val.map()
    .set('value', value)
    .set('parameter_id', dbParameter.getInt("id"))
    .set('language_id', dbLanguage.getInt("id"))

_db.update(
    'configuration', 
    dbConfiguration.getInt("id"),
    data
);

_out.json(
    _val.map()
        .set("result", true)
);