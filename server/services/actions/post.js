// _core: db/insertAndReturn

const languageCode = _req.getString("language_code");

const title = _req.getString("title");
const content = _req.getString("content");
const indication = _req.getString("indication");
const link = _req.getString("link");
const active = _req.getBoolean("active");
// const image = _req.getFile("image");

const dbActions = _db.queryFirst(`
    SELECT id, code, description FROM language WHERE code = ?
`, languageCode);

if (!dbActions) {
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
    .set('title', title)
    .set('content', content)
    .set('indication', indication)
    .set('link', link)
    .set('active', active)
    .set("language_id", dbActions.getInt("id"))
    // .set("image", image)
const dbAction = insertAndReturn('action', data);

_log.info("dbAction:", dbAction);

_out.json(
    _val.map()
        .set('result', true)
);
