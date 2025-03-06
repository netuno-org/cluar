const uid = _req.getString("uid");

const dbConfiguration = _db.get("configuration", uid);

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

const dbParameter = _db.get("configuration_parameter", dbConfiguration.getInt("parameter_id"));
const dbLanguage = _db.get("language", dbConfiguration.getInt("language_id"));

_out.json(
    _val.map()
        .set('result', true)
        .set('configuration', _val.map()
            .set('uid', dbConfiguration.getString("uid"))
            .set('value', dbConfiguration.getString("value"))
            .set('parameter', _val.map()
                .set('description', dbParameter.getString("description"))
                .set('code', dbParameter.getString("code"))
            )
            .set('language', _val.map()
                .set('description', dbLanguage.getString("description"))
                .set('code', dbLanguage.getString("code"))
            )
        )
);