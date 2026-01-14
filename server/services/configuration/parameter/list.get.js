const dbParameters = _db.form('configuration_parameter')
    .get('configuration_parameter.code')
    .get('configuration_parameter.description')
    .get("configuration_parameter_type.code", "type")
    .link("configuration_parameter_type")
    .all();

_out.json(
    _val.map()
        .set('parameters', dbParameters)
)