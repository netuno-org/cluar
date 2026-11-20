import { _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

cluar.theme.requireCurrentUserOrganizationAuthorization();

const uid = _req.getString("uid");
const dbTheme = cluar.theme.find(uid);

if (!dbTheme) {
  cluar.theme.notFound(uid);
}

cluar.response.successWithData({
  status: 200,
  data: cluar.theme.serialize(dbTheme),
});
