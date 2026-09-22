import base from "#core/cluar/base.js";
import build from "#core/cluar/build.js";

import custom from "#core/cluar/custom.js";
import action from "#core/cluar/action.js";
import db from "#core/cluar/db.js";
import image from "#core/cluar/image.js";
import organization from "#core/cluar/organization.js";
import page from "#core/cluar/page.js";
import permission from "#core/cluar/permission.js";
import response from "#core/cluar/response.js";
import user from "#core/cluar/user.js";

export default {
  ...base,
  ...build,
  custom: { ...custom },
  action: { ...action },
  db: { ...db },
  image: { ...image },
  organization: { ...organization },
  page: { ...page },
  permission: { ...permission },
  response: { ...response },
  user: { ...user },
};
