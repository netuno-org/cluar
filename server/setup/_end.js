import { _val } from "@netuno/server-types";

import cluar from "#core/cluar/main.js";

if (_val.global().getBoolean('cluar:setup')) {
  cluar.build({ images: true, publishAll: true });
  _val.global().set('cluar:setup', false);
}
