import cluar from "#core/cluar/main.js"

const dbPageVersion = _db.get(
  "page_version",
  _dataItem.getRecord().getInt("page_version_id")
);
const dbPage = _db.get("page", dbPageVersion.getInt("page_id"));
dbPage.set("page_version_id", dbPageVersion.getInt("id"))

cluar.publishPage(dbPage);
