const pagination = _req.get("pagination");
const pageSize = 10;
const page = { start: 0, size: pageSize };
const pageUID = _req.getString("page_uid");

if (pagination) {
  page.size = pagination.getInt("size", pageSize);

  if (page.size > 100) {
    page.size = 100;
  }
  page.start = (pagination.getInt("page", 1) - 1) * page.size;
}

const dbPage = _db.queryFirst(`
  SELECT
    *
  FROM
    page
  WHERE uid = '${pageUID}'
`);

if (dbPage) {
  const dbPageVersions = _db.query(`
    SELECT
      pv.lastchange_time,
      pv.uid,
      pv.version,
      ps.code
    FROM
      page_version pv
    INNER JOIN page_status ps ON ps.id = pv.status_id
    WHERE 1 = 1
      AND pv.page_id = ${dbPage.getInt("id")}
    ORDER BY pv.lastchange_time DESC
    LIMIT ${page.size} OFFSET ${page.start}
  `);

  const dbPageVersionsTotal = _db.queryFirst(`
    SELECT
      count(1) AS total
    FROM
      page_version pv
    WHERE pv.page_id = 34
  `);

  _out.json(
    _val
      .map()
      .set("result", true)
      .set("versions", dbPageVersions)
      .set("total_versions", dbPageVersionsTotal.getInt("total"))
  );
}
