import { _db, _val, _out } from "@netuno/server-types";

const dbParameters = _db.form('configuration_parameter')
  .get('configuration_parameter.uid')
  .get('configuration_parameter.code')
  .get('configuration_parameter.description')
  .get('configuration_parameter_type.code', 'type_code')
  .link("configuration_parameter_type")
  .all();

_out.json(
  _val.map()
    .set('parameters', dbParameters)
);
