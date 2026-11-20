import { _app, _db, _user, _val } from "@netuno/server-types";
import permission from "#core/cluar/permission.js";
import response from "#core/cluar/response.js";
import { DEFAULT_THEME_CONTENT } from "#core/cluar/theme-content.js";

const currentUserOrganization = () =>
  _db.queryFirst(
    `
    SELECT organization.id
    FROM organization_profile
    INNER JOIN profile
        ON organization_profile.profile_id = profile.id
    INNER JOIN organization
        ON organization_profile.organization_id = organization.id
    WHERE profile.profile_user_id = ${_db.param("int")}`,
    _user.id,
  );

const requireCurrentUserOrganizationAuthorization = () => {
  const dbOrganization = currentUserOrganization();

  if (!dbOrganization) {
    response.error({
      status: 404,
      error: "organization not found for current user",
      error_code: "organization-not-found",
    });
  }

  permission.requireUserAuthorizedInOrganization(dbOrganization.getInt("id"));
};

const find = (uid) => _db.get("theme", uid);

const notFound = (uid) =>
  response.error({
    status: 404,
    error: `theme not found with uid: ${uid}`,
    error_code: "theme-not-found",
  });

const serialize = (dbTheme) =>
  _val
    .map()
    .set("uid", dbTheme.getString("uid"))
    .set("title", dbTheme.getString("title"))
    .set("content", dbTheme.getString("content"))
    .set("applied", dbTheme.getBoolean("applied"));

const setApplied = (themeId, applied) => {
  if (applied) {
    _db.execute(
      "UPDATE theme SET applied = (id = ?) WHERE applied = true OR id = ?",
      themeId,
      themeId,
    );
  } else {
    _db.execute("UPDATE theme SET applied = false WHERE id = ?", themeId);
  }
};

const writeAppliedThemeFile = () => {
  const dbAppliedTheme = _db.queryFirst(
    "SELECT content FROM theme WHERE applied = true LIMIT 1",
  );

  let content = DEFAULT_THEME_CONTENT;

  if (dbAppliedTheme) {
    const themeContent = dbAppliedTheme.getString("content");

    try {
      JSON.parse(themeContent);
      content = themeContent;
    } catch (error) {}
  }

  _app.file("website/public/antdTheme.json").output().print(content).close();

  if (_app.isFolder("website/dist")) {
    _app.file("website/dist/antdTheme.json").output().print(content).close();
  }
};

export default {
  currentUserOrganization,
  requireCurrentUserOrganizationAuthorization,
  find,
  notFound,
  serialize,
  setApplied,
  writeAppliedThemeFile,
};
