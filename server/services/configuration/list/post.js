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
.link(
    'language',
    where.get('language')
)
.get('configuration.id', 'configuration_id')
.get('configuration."value"')
.get('configuration.uid', 'configuration_uid')
.get('configuration.active', 'configuration_active')
.get('language.id', 'language_id')
.get('language.description', 'language_description')
.get('language.code', 'languge_code')
.get('configuration_parameter.id', 'parameter_id')
.get('configuration_parameter.code', 'parameter_code')
.get('configuration_parameter.description', 'parameter_description')
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
            .set('parameter', _val.map()
                .set('description', dbItem.getString('parameter_description'))
                .set('code', dbItem.getString('parameter_code'))
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

