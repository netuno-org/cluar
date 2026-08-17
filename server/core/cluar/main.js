
import cluarBase from "#core/cluar/base.js"
import cluarBuild from "#core/cluar/build.js"
import cluarPublishImage from "#core/cluar/publishImage.js"
import cluarDataItemSaved from "#core/cluar/dataItemSaved.js"
import cluarActions from "#core/cluar/actions.js"

import cluarPageMain from "#core/cluar/page/main.js"

import cluarCustomMain from "#core/cluar/custom/main.js"


const cluar = {
  ...cluarBase,
  ...cluarBuild,
  ...cluarPublishImage,
  ...cluarDataItemSaved,
  ...cluarActions,
  custom: cluarCustomMain,
  page: cluarPageMain,
};

export default cluar;
