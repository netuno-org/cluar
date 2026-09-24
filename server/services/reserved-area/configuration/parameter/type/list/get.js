import { _db } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const dbParameterTypes = _db.form("configuration_parameter_type")
  .get("configuration_parameter_type.code")
  .get("configuration_parameter_type.name")
  .all();

cluar.response.successWithData({
  status: 200,
  data: dbParameterTypes
});
