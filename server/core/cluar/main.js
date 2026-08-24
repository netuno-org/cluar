import base from "#core/cluar/base.js";
import build from "#core/cluar/build.js";
import publishImage from "#core/cluar/publishImage.js";
import dataItemSaved from "#core/cluar/dataItemSaved.js";
import publishPage from "#core/cluar/publishPage.js";

import custom from "#core/cluar/custom/main.js";

import action from "#core/cluar/action.js";
import db from "#core/cluar/db.js";
import organization from "#core/cluar/organization.js";
import permission from "#core/cluar/permission.js";
import response from "#core/cluar/response.js";
import user from "#core/cluar/user.js";

export default {
  ...base,
  ...build,
  ...publishImage,
  ...dataItemSaved,
  ...publishPage,
  custom: custom,
  action: { ...action },
  db: { ...db },
  organization: { ...organization },
  permission: { ...permission },
  response: { ...response },
  user: { ...user },
};
