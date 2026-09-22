import { _db, _val, _req, _out } from "@netuno/server-types";

const filters = _req.getValues("filters");
const pagination = _req.getValues("pagination");
const page = _db.pagination(1, 10).useGroup(false);
const where = _val.map()
  .set('language', _db.where());

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

const query = _db.form('translation')
  .link(
    'language',
    where.get('language')
  )
  .link(
    'translation_entry'
  )
  .get('translation.uid', 'translation_uid')
  .get('translation.id', 'translation_id')
  .get('translation.value', 'translation_value')
  .get('language.id', 'language_id')
  .get('language.description', 'language_description')
  .get('language.code', 'language_code')
  .get('translation_entry.id', 'entry_id')
  .get('translation_entry.description', 'entry_description')
  .get('translation_entry.code', 'entry_code')
  .group(
    'translation.id',
    'language.id',
    'translation_entry.id'
  )
  .order("translation.id", "desc");

const dbPage = query.page(page);
const items = _val.list();

for (const dbItem of dbPage.getList('items')) {
  items.add(
    _val.map()
      .set('uid', dbItem.getString("translation_uid"))
      .set('value', dbItem.getString("translation_value"))
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
