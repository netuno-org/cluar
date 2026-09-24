import { _db } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const dbParameters = _db.form("configuration_parameter")
  .get("configuration_parameter.uid")
  .get("configuration_parameter.code")
  .get("configuration_parameter.description")
  .get("configuration_parameter_type.code", "type_code")
  .link("configuration_parameter_type")
  .all();

cluar.response.successWithData({
  status: 200,
  data: dbParameters
});
