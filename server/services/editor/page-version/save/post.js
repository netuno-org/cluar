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
    _log.info("idwdiwijdij", structure);

    if (status === "to_create") {
      if (sectionType === "banner") {
        const newSectionType = _db.queryFirst(`
          SELECT
            *
          FROM
            banner_type
          WHERE code = '${structure.getString("type")}'
        `);

        const newSection = _db.insert(
          "banner",
          _val
            .map()
            .set("title", structure.getString("title"))
            .set("content", structure.getString("content"))
            .set("type_id", newSectionType.getInt("id"))
        );

        _db.insert(
          "page_banner",
          _val
            .map()
            .set("banner_id", newSection)
            .set("page_version_id", newPageVersion)
            .set("sorter", 0)
        );
      } else if (sectionType === "content"){
        const newSectionType = _db.queryFirst(`
          SELECT
            *
          FROM
            content_type
          WHERE code = '${structure.getString("type")}'
        `);

        const newSection = _db.insert(
          "content",
          _val
            .map()
            .set("title", structure.getString("title"))
            .set("content", structure.getString("content"))
            .set("type_id", newSectionType.getInt("id"))
        );

        _db.insert(
          "page_content",
          _val
            .map()
            .set("content_id", newSection)
            .set("page_version_id", newPageVersion)
            .set("sorter", 0)
        );
      }
    } else if (status === "to_update") {
    }
  }
}

_out.json(_val.map().set("result", true));
