import { _db, _val, _req, _out } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

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
const sorterInput = _req.getString("sorter");

if (menu === true && !menuTitle) {
  cluar.response.error({
    status: 400,
    error: "menu_title is required when menu is enabled",
    error_code: "page-menu-title-required"
  });
}

const dbLanguage = _db.queryFirst(`
    SELECT id, code, description FROM language WHERE code = ?
`, languageCode);

if (!dbLanguage) {
  cluar.response.error({
    status: 404,
    error: `language not found with code: ${languageCode}`,
    error_code: "language-not-found"
  });
}

const linkExists = _db.queryFirst(`
    SELECT * FROM page 
    WHERE link = ?
        AND language_id = ?
`, link, dbLanguage.getInt("id"));

if (linkExists) {
  cluar.response.error({
    status: 409,
    error: `page link already exists: ${link}`,
    error_code: "page-link-already-exists"
  });
}

const dbPageStatusPublished = _db.queryFirst("SELECT id, code, description FROM page_status WHERE code = 'published'");
let parentPage = null;
if (parentUid != null) {
  parentPage = _db.get("page", parentUid);
}
const parentId = parentPage ? parentPage.getInt("id") : 0;

let sorter = sorterInput ? parseInt(sorterInput, 10) : NaN;
if (isNaN(sorter)) {
  const dbMaxSorter = _db.queryFirst(`
        SELECT MAX(sorter) as max_sorter FROM page
        WHERE language_id = ?
            AND parent_id = ?
    `, dbLanguage.getInt("id"), parentId);

  sorter = (dbMaxSorter?.getInt("max_sorter") || 0) + 10;
}

const data = _val.map()
  .set("title", title)
  .set("description", description)
  .set("keywords", keywords)
  .set("link", link)
  .set("menu", menu)
  .set("menu_title", menuTitle)
  .set("navigable", navigable)
  .set("language_id", dbLanguage.getInt("id"))
  .set("status_id", dbPageStatusPublished.getInt("id"))
  .set("parent_id", parentId)
  .set("sorter", sorter)
  .set("social_image", social_image)
  .set("social_description", social_description)
  .set("template", template);

const dbPage = cluar.db.insertAndReturn("page", data);

_out.json(
  _val.map()
    .set("result", true)
);
