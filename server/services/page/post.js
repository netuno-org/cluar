// _core: db/insertAndReturn

const languageCode = _req.getString("language_code");

const parentUid = _req.getString("parent_uid", null);
const title = _req.getString("title");
const description = _req.getString("description");
const keywords = _req.getString("keywords");
const link = _req.getString("link");
const menu = _req.getBoolean("menu");
const menuTitle = _req.getString("menu_title");
const navigable = _req.getBoolean("navigable");
const social_image = _req.getFile("social_image");
const social_description = _req.getString("social_description");

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

const linkExists = _db.queryFirst(`
    SELECT * FROM page 
    WHERE link = ?
        AND language_id = ?
`, link, dbLanguage.getInt("id"));

if (linkExists) {
    _header.status(409);
    _out.json(
        _val.map()
            .set('result', false)
            .set('error', `page link already exists: ${link}`)
            .set('error_code', `page-link-already-exists`)
    );
    _exec.stop();
}

const dbPageStatusPublished = _db.queryFirst(`SELECT id, code, description FROM page_status WHERE code = 'published'`);
let parentPage = null;
if (parentUid != null) {
    parentPage = _db.get("page", parentUid);
}

const data = _val.map()
    .set('title', title)
    .set('description', description)
    .set('keywords', keywords)
    .set('link', link)
    .set('menu', menu)
    .set('menu_title', menuTitle)
    .set('navigable', navigable)
    .set("language_id", dbLanguage.getInt("id"))
    .set("status_id", dbPageStatusPublished.getInt("id"))
    .set("parent_id", parentPage ? parentPage.getInt("id") : 0)
    .set("social_image", social_image)
    .set("social_description", social_description)

const dbPage = insertAndReturn('page', data);

_log.info("dbPage:", dbPage);

_out.json(
    _val.map()
        .set('result', true)
);
