const filters = _req.getValues("filters");
const pagination = _req.getValues("pagination");
const page = _db.pagination(1, 10).useGroup(false);
const where = _val.map()
    .set('language', _db.where())

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
}

const query = _db.form('dictionary')
.link(
    'language',
    where.get('language')
)
.link(
    'dictionary_entry'
)
.get('dictionary.uid', 'dictionary_uid')
.get('dictionary.id', 'dictionary_id')
.get('dictionary.value', 'dictionary_value')
.get('language.id', 'language_id')
.get('language.description', 'language_description')
.get('language.code', 'language_code')
.get('dictionary_entry.id', 'entry_id')
.get('dictionary_entry.description', 'entry_description')
.get('dictionary_entry.code', 'entry_code')
.group(
    'dictionary.id',
    'language.id', 
    'dictionary_entry.id'
)
.order("dictionary.id", "desc")

const dbPage = query.page(page);
const items = _val.list();

for (const dbItem of dbPage.getList('items')) {
    items.add(
        _val.map()
            .set('uid', dbItem.getString("dictionary_uid"))
            .set('value', dbItem.getString("dictionary_value"))
            .set('language', _val.map()
                .set('code', dbItem.getString("language_code"))
                .set('description', dbItem.getString("language_description"))
            )
            .set('entry', _val.map()
                .set('code', dbItem.getString("entry_code"))
                .set('description', dbItem.getString("entry_description"))
            )
    );
}

dbPage.set('items', items);

_out.json(
    _val.map()
        .set('page', dbPage)
);