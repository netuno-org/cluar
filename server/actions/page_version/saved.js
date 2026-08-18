import cluar from "#core/cluar/main.js"

const dbPage = _db.get("page", _dataItem.getRecord().getInt("page_id"));

cluar.page.publish(dbPage);
