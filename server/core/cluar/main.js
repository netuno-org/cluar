import cluarBase from "#core/cluar/base.js"
import cluarBuild from "#core/cluar/build.js"
import cluarPublishImage from "#core/cluar/publishImage.js"
import cluarDataItemSaved from "#core/cluar/dataItemSaved.js"
import cluarActions from "#core/cluar/actions.js"
import cluarPublishPage from "#core/cluar/publishPage.js"

import cluarCustom from "#core/cluar/custom/main.js"

import cluarDBInsertAndReturn from "#core/cluar/db/insertAndReturn.js"
import cluarOrganizationIsDescendant from "#core/cluar/organization/organizationIsDescendant.js"

import cluarPermission from "#core/cluar/permission.js"

const cluar = {
  ...cluarBase,
  ...cluarBuild,
  ...cluarPublishImage,
  ...cluarDataItemSaved,
  ...cluarActions,
  ...cluarPublishPage,
  custom: cluarCustom,
  db: { ...cluarDBInsertAndReturn },
  organization: { ...cluarOrganizationIsDescendant },
  permission: { ...cluarPermission },
};

export default cluar;
