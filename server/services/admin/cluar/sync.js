import { _val, _out } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

cluar.build({ images: true, publishAll: true });

_out.json(_val.map().set('result', true));
