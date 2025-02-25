const dbEntries = _db.form('dictionary_entry')
.get('description')
.get('code')
.all();

_out.json(
    _val.map()
        .set('entries', dbEntries)
        .set('result', true)
);