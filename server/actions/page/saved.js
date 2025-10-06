// _core : cluar/main

//_log.debug("_dataItem.getRecord()", _dataItem.getRecord());
const data = _dataItem.getRecord();
const lastPageVersion = _db.queryFirst(`
    SELECT
      p.id,
      pv.version
    FROM
      page_version pv
    INNER JOIN page p ON p.id = pv.page_id
    WHERE p.id = '${data.getInt("id")}'
    ORDER BY pv.version DESC
`);

//_log.debug("lastPageVersion", lastPageVersion);
if (!lastPageVersion) {
    _log.error("Version not found");

    _db.insert(
        "page_version",
        _val
            .map()
            .set("page_id", data.getInt("id"))
            .set("version", 1)
            .set("status_id", data.getInt("status_id"))
            .set("created_at", _db.timestamp())
    );
}

cluar.page.publish(_dataItem.getRecord())
cluar.build()