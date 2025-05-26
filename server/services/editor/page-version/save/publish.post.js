const page = _req.getString("page");
const pageVersion = _req.getString("page_version");

const publishStatus = _db.queryFirst(`
    SELECT
      *
    FROM page_status
    WHERE code = 'publish'
`);

const dbPageVersion = _db.get("page_version", pageVersion);

_out.json(
    _val.map()
      .set("result", true)
      .set("data", newPageVersion)
);