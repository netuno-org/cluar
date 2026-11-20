import { _val, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

cluar.theme.requireCurrentUserOrganizationAuthorization();

const title = _req.getString("title");
const content = _req.getString("content");
const applied = _req.getBoolean("applied");

const data = _val
  .map()
  .set("title", title)
  .set("content", content)
  .set("applied", false);

const dbTheme = cluar.db.insertAndReturn("theme", data);
const themeId = dbTheme.getInt("id");

if (applied) {
  cluar.theme.setApplied(themeId, true);
  cluar.theme.writeAppliedThemeFile();
}

const dbSavedTheme = cluar.theme.find(dbTheme.getString("uid"));

cluar.response.successWithData({
  status: 200,
  data: cluar.theme.serialize(dbSavedTheme),
});
