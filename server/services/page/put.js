const uid = _req.getString("uid");

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
const template = _req.getString("template");

const dbLanguage = _db.queryFirst(
  `
    SELECT id, code, description FROM language WHERE code = ?
`,
  languageCode
);

const dbPage = _db.get("page", uid);
if (!dbPage) {
  _header.status(404);
  _out.json(
    _val
      .map()
      .set("result", false)
      .set("error", `page not found with uid: ${uid}`)
      .set("error_code", `page-not-found`)
  );
  _exec.stop();
}

const linkExists = _db.queryFirst(
  `
    SELECT * FROM page 
    WHERE link = ? 
        AND uid != ?::uuid
        AND language_id = ?
`,
  link,
  uid,
  dbPage.getInt("language_id")
);

if (linkExists) {
  _header.status(409);
  _out.json(
    _val
      .map()
      .set("result", false)
      .set("error", `page link already exists: ${link}`)
      .set("error_code", `page-link-already-exists`)
  );
  _exec.stop();
}

let parentPage = null;
if (parentUid) {
  parentPage = _db.get("page", parentUid);
}

const data = _val
  .map()
  .set("title", title)
  .set("description", description)
  .set("keywords", keywords)
  .set("link", link)
  .set("menu", menu)
  .set("menu_title", menuTitle)
  .set("navigable", navigable)
  .set("parent_id", parentPage ? parentPage.getInt("id") : 0)
  .set("social_description", social_description)
  .set("template", template)
  .set("language_id", dbLanguage.getInt("id"));

if (social_image != null) {
  data.set("social_image", social_image)
} else {
  data.set("social_image", "")
}

_db.update(
  'page',
  dbPage.getInt("id"),
  data
)

_out.json(
  _val.map()
    .set('result', true)
)
