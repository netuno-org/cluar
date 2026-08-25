const dbParameterTypes = _db.form('configuration_parameter_type')
    .get('configuration_parameter_type.code')
    .get('configuration_parameter_type.name')
    .all();

_out.json(
    _val.map()
        .set('types', dbParameterTypes)
)