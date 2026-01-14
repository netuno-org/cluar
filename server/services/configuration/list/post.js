const filters = _req.getValues("filters");
const pagination = _req.getValues("pagination");
const page = _db.pagination(1, 10);
const where = _val.map()
    .set('language', _db.where())
    .set('parameter', _db.where())

if (pagination) {
    page.size(pagination.getInt("size"));
    page.page(pagination.getInt("page"));

    if (page.size() > 100) {
        page.size(100);
    }
}

if (filters) {
    const languageCodes = filters.has('language_codes') && filters.getList('language_codes');

    if (languageCodes && languageCodes.size() > 0) {
        where.get('language').and('code').in(languageCodes);
    }

    const parameterCodes = filters.has('parameter_codes') && filters.getList('parameter_codes');

    if (parameterCodes && parameterCodes.size() > 0) {
        where.get('parameter').and('code').in(parameterCodes);
    }
}

const query = _db.form('configuration')
.link(
    'configuration_parameter',
    where.get('parameter')
)
.leftJoin(
    _db.manyToOne(
        'language', 
        'language_id',  
    )
)
.join(
    _db.manyToOne(
        'configuration_parameter', 
        'parameter_id',  
    ).join(
        _db.manyToOne(
            'configuration_parameter_type',
            'configuration_parameter_type_id',
        )
    )
)
.get('configuration.id', 'configuration_id')
.get('configuration."value"')
.get('configuration.value_img')
.get('configuration.uid', 'configuration_uid')
.get('configuration.active', 'configuration_active')
.get('language.id', 'language_id')
.get('language.description', 'language_description')
.get('language.code', 'languge_code')
.get('configuration_parameter.id', 'parameter_id')
.get('configuration_parameter.code', 'parameter_code')
.get('configuration_parameter.description', 'parameter_description')
.get("configuration_parameter_type.code", "type_code")
.get("configuration_parameter_type.name", "type_name")
.group(
    'configuration.id',
    'language.id',
    'configuration_parameter.id'
)
.order('configuration.id', 'desc')

const dbPage = query.page(page);
const items = _val.list();

for (const dbItem of dbPage.getList('items')) {
    items.add(
        _val.map()
            .set('uid', dbItem.getString('configuration_uid'))
            .set('active', dbItem.getBoolean('configuration_active'))
            .set('value', dbItem.getString('value'))
            .set('value_img', dbItem.getString('value_img'))
            .set('parameter', _val.map()
                .set('description', dbItem.getString('parameter_description'))
                .set('code', dbItem.getString('parameter_code'))
            )
            .set('parameter_type', _val.map()
                .set("code", dbItem.getString('type_code'))
                .set("name", dbItem.getString('type_name'))
            )
            .set('language', _val.map()
                .set('description', dbItem.getString('language_description'))
                .set('code', dbItem.getString('languge_code'))
            )
    )
}
dbPage.set('items', items);

_out.json(
    _val.map()
        .set('page', dbPage)
)

