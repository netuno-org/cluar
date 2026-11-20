import { _dataItem } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

if (_dataItem.getRecord().getBoolean("applied")) {
  cluar.theme.writeAppliedThemeFile();
}
