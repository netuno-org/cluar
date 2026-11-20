import { _db, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

cluar.theme.requireCurrentUserOrganizationAuthorization();

const uid = _req.getString("uid");
const dbTheme = cluar.theme.find(uid);

if (!dbTheme) {
  cluar.theme.notFound(uid);
}

if (dbTheme.getBoolean("applied")) {
  cluar.response.error({
    status: 409,
    error: "theme is applied and cannot be deleted",
    error_code: "theme-in-use",
  });
}

_db.delete("theme", dbTheme.getInt("id"));

cluar.response.successWithoutData({ status: 200 });
