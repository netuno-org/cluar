const dbParameters = _db.form('configuration_parameter')
.get('code')
.get('description')
.all();

_out.json(
    _val.map()
        .set('parameters', dbParameters)
)