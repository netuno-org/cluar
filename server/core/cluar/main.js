import base from "#core/cluar/base.js"
import build from "#core/cluar/build.js"
import publishImage from "#core/cluar/publishImage.js"
import dataItemSaved from "#core/cluar/dataItemSaved.js"
import actions from "#core/cluar/actions.js"
import publishPage from "#core/cluar/publishPage.js"

import custom from "#core/cluar/custom/main.js"

import db from "#core/cluar/db.js"
import organization from "#core/cluar/organization.js"
import permission from "#core/cluar/permission.js"
import response from "#core/cluar/response.js"
import user from "#core/cluar/user.js"

export default {
  ...base,
  ...build,
  ...publishImage,
  ...dataItemSaved,
  ...actions,
  ...publishPage,
  custom: custom,
  db: { ...db },
  organization: { ...organization },
  permission: { ...permission },
  response: { ...response },
  user: { ...user },
};
