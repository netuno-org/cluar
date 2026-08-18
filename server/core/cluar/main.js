
import cluarBase from "#core/cluar/base.js"
import cluarBuild from "#core/cluar/build.js"
import cluarPublishImage from "#core/cluar/publishImage.js"
import cluarDataItemSaved from "#core/cluar/dataItemSaved.js"
import cluarActions from "#core/cluar/actions.js"

import cluarPage from "#core/cluar/page/main.js"

import cluarCustom from "#core/cluar/custom/main.js"


const cluar = {
  ...cluarBase,
  ...cluarBuild,
  ...cluarPublishImage,
  ...cluarDataItemSaved,
  ...cluarActions,
  custom: cluarCustom,
  page: cluarPage,
};

export default cluar;
