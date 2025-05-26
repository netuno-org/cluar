const page = _req.getString("page");
const structures = _req.get("structures");

const lastPageVersion = _db.queryFirst(`
  SELECT
    p.id,
    pv.version
  FROM
    page_version pv
  INNER JOIN page p ON p.id = pv.page_id
  WHERE p.uid = '${page}'
  ORDER BY pv.version DESC
`);

if (lastPageVersion) {
  const draftStatus = _db.queryFirst(`
    SELECT
      *
    FROM
      page_status
    WHERE code = 'draft'
  `);

  const newPageVersion = _db.insert(
    "page_version",
    _val
      .map()
      .set("page_id", lastPageVersion.getInt("id"))
      .set("version", lastPageVersion.getInt("version") + 1)
      .set("status_id", draftStatus.getInt("id"))
  );

  for (const structure of structures) {
    const status = structure.getString("status");
    const sectionType = structure.getString("section");

    if (sectionType === "banner") {
      const newSectionType = _db.queryFirst(`
        SELECT
          *
        FROM
          page_banner_type
        WHERE code = '${structure.getString("type")}'
      `);

      _db.insert(
        "page_banner",
        _val
          .map()
          .set("title", structure.getString("title"))
          .set("content", structure.getString("content"))
          .set("type_id", newSectionType.getInt("id"))
          .set("page_version_id", newPageVersion)
          .set("sorter", 0)
      );
    } else if (sectionType === "content") {
      const newSectionType = _db.queryFirst(`
        SELECT
          *
        FROM
          page_content_type
        WHERE code = '${structure.getString("type")}'
      `);

      _db.insert(
        "page_content",
        _val
          .map()
          .set("title", structure.getString("title"))
          .set("content", structure.getString("content"))
          .set("type_id", newSectionType.getInt("id"))
          .set("page_version_id", newPageVersion)
          .set("sorter", 0)
      );
    }

    /*if (status === "to_create") {

    } else if (status === "to_update") {
      
    }*/
  }

  _out.json(
    _val.map()
      .set("result", true)
      .set("data", newPageVersion)
  );
} else {

}


