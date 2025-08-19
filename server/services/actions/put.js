const uid = _req.getString("uid");

const languageCode = _req.getString("language_code");
const title = _req.getString("title");
const content = _req.getString("content");
const indication = _req.getString("indication");
const link = _req.getString("link");
const active = _req.getBoolean("active");
const image = _req.getFile("image");

const dbLanguage = _db.queryFirst(`
    SELECT id, code, description FROM language WHERE code = ?
`, languageCode);

const dbAction = _db.get('action', uid);
if (!dbAction) {
    _header.status(404);
    _out.json(
        _val
            .map()
            .set("result", false)
            .set("error", `action not found with uid: ${uid}`)
            .set("error_code", `action-not-found`)
    );
    _exec.stop();
}

const data = _val.map()
    .set('title', title)
    .set('content', content)
    .set('indication', indication)
    .set('link', link)
    .set('active', active)
    .set("language_id", dbLanguage.getInt("id"))
    .set("image", image);

_db.update(
    'action',
    dbAction.getInt("id"),
    data
)


_out.json(
    _val.map()
        .set('result', true)
);
