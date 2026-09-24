import { _db, _val, _req } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const uid = _req.getString("uid");

const dbConfiguration = _db.get("configuration", uid);

if (!dbConfiguration) {
  cluar.response.error({
    status: 404,
    error: `configuration not found with uid: ${uid}`,
    error_code: "configuration-not-found"
  });
}

const dbParameter = _db.get("configuration_parameter", dbConfiguration.getInt("parameter_id"));
const dbLanguage = _db.get("language", dbConfiguration.getInt("language_id"));
const dbParameterType = _db.get("configuration_parameter_type", dbParameter.getInt("configuration_parameter_type_id"));

cluar.response.successWithData({
  status: 200,
  data: _val.map()
    .set("uid", dbConfiguration.getString("uid"))
    .set("value", dbConfiguration.getString("value"))
    .set("parameter", _val.map()
      .set("description", dbParameter.getString("description"))
      .set("code", dbParameter.getString("code"))
      .set("type_code", dbParameterType.getString("code"))
    )
    .set("language", _val.map()
      .set("description", dbLanguage.getString("description"))
      .set("code", dbLanguage.getString("code"))
    )
});
