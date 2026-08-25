const uid = _req.getString("uid");
const active = _req.getBoolean("active");

const dbLanguage = _db.queryFirst(`
    SELECT
       id
    FROM
        language
    WHERE 1 = 1
        AND uid = ?::uuid
`, uid);

if (!dbLanguage) {
    _header.status(404);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error', `language not found with uid: ${uid}`)
            .set('error_code', `language-not-found`)
    );
    _exec.stop();
}

_db.update(
    'language',
    dbLanguage.getInt("id"),
    _val.map()
        .set('active', active)
);

_out.json(
    _val.map()
        .set('result', true)
)