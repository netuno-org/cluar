const uid = _req.getString("uid");

const dbLanguage = _db.queryFirst(`
    SELECT
        uid,
        active, 
        "default",
        description,
        code,
        locale
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

_out.json(
    _val.map()
        .set('result', true)
        .set('language', dbLanguage)
)

