import { _db, _val, _req, _out } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

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
const sorterInput = _req.getString("sorter");

const dbLanguage = _db.queryFirst(
  `
    SELECT id, code, description FROM language WHERE code = ?
`,
  languageCode
);

const dbPage = _db.get("page", uid);
if (!dbPage) {
  cluar.response.error({
    status: 404,
    error: `page not found with uid: ${uid}`,
    error_code: "page-not-found"
  });
}

if (menu === true && !menuTitle) {
  cluar.response.error({
    status: 400,
    error: "menu_title is required when menu is enabled",
    error_code: "page-menu-title-required"
  });
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
  cluar.response.error({
    status: 409,
    error: `page link already exists: ${link}`,
    error_code: "page-link-already-exists"
  });
}

let parentPage = null;
if (parentUid) {
  parentPage = _db.get("page", parentUid);
}
const parentId = parentPage ? parentPage.getInt("id") : 0;
const parentChanged = parentId !== dbPage.getInt("parent_id");

let sorter = sorterInput ? parseInt(sorterInput, 10) : NaN;
if (isNaN(sorter)) {
  if (parentChanged) {
    const dbMaxSorter = _db.queryFirst(`
      SELECT MAX(sorter) as max_sorter FROM page
      WHERE language_id = ?
        AND parent_id = ?
        AND uid != ?::uuid
    `, dbLanguage.getInt("id"), parentId, uid);

    sorter = (dbMaxSorter?.getInt("max_sorter") || 0) + 10;
  } else {
    sorter = dbPage.getInt("sorter");
  }
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
  .set("parent_id", parentId)
  .set("sorter", sorter)
  .set("social_description", social_description)
  .set("template", template)
  .set("language_id", dbLanguage.getInt("id"));

if (social_image != null) {
  data.set("social_image", social_image);
} else {
  data.set("social_image", "");
}

_db.update(
  "page",
  dbPage.getInt("id"),
  data
);

_out.json(
  _val.map()
    .set("result", true)
);
