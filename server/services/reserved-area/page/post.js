import { _db, _val, _req, _user } from "@netuno/server-types";
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

if (parentUid) {
  const dbParentPageOrganization = _db.queryFirst(`
      SELECT organization.id
      FROM page
      INNER JOIN page_organization
      ON page.id = page_organization.page_id
      INNER JOIN organization ON page_organization.organization_id = organization.id
      WHERE page.uid = ${_db.param("uid")}`,
    parentUid);

  if (!dbParentPageOrganization) {
    cluar.response.error({
      status: 404,
      error: `parent page not found, or not associated with any organization, with uid: ${parentUid}`,
      error_code: "parent-page-not-found"
    });
  }

  cluar.permission.requireUserAuthorizedInOrganization(dbParentPageOrganization.getInt("id"));
}

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

const newPageId = dbPage.getInt("id");

let organizationId;

if (parentId === 0) {
  organizationId = _db.queryFirst(`
    SELECT organization_id
    FROM organization_profile
    INNER JOIN profile
        ON organization_profile.profile_id = profile.id
    WHERE profile.profile_user_id = ${_db.param("int")}`,
    _user.id)
    .getInt("organization_id");
} else {
  organizationId = _db.queryFirst(`
    SELECT organization_id
    FROM page_organization
    WHERE page_id = ${_db.param("int")}`,
    parentId)
    .getInt("organization_id");
}

const dbPageOrganizationId = _db.insert("page_organization",
  _val.map()
    .set("page_id", newPageId)
    .set("organization_id", organizationId)
);

const organizationCode = _db.queryFirst(`
    SELECT organization.code 
    FROM page_organization
    INNER JOIN organization
    ON page_organization.organization_id = organization.id
    WHERE page_organization.id = ${_db.param("int")}`,
  dbPageOrganizationId)
  .getString("code");

const newPageDb = _db.queryFirst(`
    SELECT uid, title, link
    FROM page
    WHERE id = ${_db.param("int")}`,
  newPageId);

cluar.response.successWithData({
  status: 200,
  data: _val.map()
    .set("uid", newPageDb.getString("uid"))
    .set("title", newPageDb.getString("title"))
    .set("link", newPageDb.getString("link"))
    .set("organizationCode", organizationCode)
});
