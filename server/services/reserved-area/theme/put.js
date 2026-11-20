import { _db, _val, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

cluar.theme.requireCurrentUserOrganizationAuthorization();

const uid = _req.getString("uid");
const dbTheme = cluar.theme.find(uid);

if (!dbTheme) {
  cluar.theme.notFound(uid);
}

const themeId = dbTheme.getInt("id");

if (_req.has("applied")) {
  cluar.theme.setApplied(themeId, _req.getBoolean("applied"));
  cluar.theme.writeAppliedThemeFile();
}

_db.update(
  "theme",
  themeId,
  _val.map()
    .set("title", _req.getString("title"))
    .set("content", _req.getString("content")),
);

cluar.response.successWithoutData({ status: 200 });
