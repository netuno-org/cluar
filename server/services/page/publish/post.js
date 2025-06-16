// _core: cluar/main

const pageVersionUid = _req.getString("page_version_uid");

const dbPageStatusDraft = _db.queryFirst(
  `
    SELECT
      *
    FROM page_status
    WHERE page_status.code = 'draft'
  `
);
const dbPageStatusPublished = _db.queryFirst(
  `
    SELECT
      *
    FROM page_status
    WHERE page_status.code = 'published'
  `
);

const dbPageVersion = _db.get("page_version", pageVersionUid);
if (!dbPageVersion) {
  _header.status(400);
  _out.json({
    result: false,
    error: "page-version-not-found"
  });

  _exec.stop();
}

const dbPage = _db.get("page", dbPageVersion.getInt("page_id"));
if (!dbPage) {
  _header.status(400);
  _out.json({
    result: false,
    error: "page-not-found"
  });

  _exec.stop();
}

_db.form("page_version")
  .where(
    _db.where("page_id")
      .equals(dbPageVersion.getInt("page_id"))
  )
  .set("status_id", dbPageStatusDraft.getInt("id"))
  .update();
_db.update(
  "page_version",
  dbPageVersion.getInt("id"),
  _val.map()
    .set("status_id", dbPageStatusPublished.getInt("id"))
);

cluar.page.publish(dbPage);
