const pageVersion = _req.getString("uid");

const dbPageVersion = _db.get("page_version", pageVersion);

if (pageVersion) {
  _db.execute(
    `
    DELETE FROM page_content
    WHERE page_version_id = ?
  `,
    dbPageVersion.getInt("id")
  );

  _db.execute(
    `
    DELETE FROM page_banner
    WHERE page_version_id = ?
  `,
    dbPageVersion.getInt("id")
  );

  _db.execute(
    `
    DELETE FROM page_functionality
    WHERE page_version_id = ?
  `,
    dbPageVersion.getInt("id")
  );

  const dbListings = _db.query(
    `
    SELECT
      *
    FROM
      page_listing
    WHERE 1 = 1
    AND page_version_id = ?
  `,
    dbPageVersion.getInt("id")
  );

  dbListings.forEach((dbListing) => {
    _db.execute(
      `
      DELETE FROM page_listing_item
      WHERE page_listing_id = ?
    `,
      dbListing.getInt("id")
    );
  });

  _db.execute(
    `
    DELETE FROM page_listing
    WHERE page_version_id = ?
  `,
    dbPageVersion.getInt("id")
  );

  const dbSliders = _db.query(
    `
    SELECT
      *
    FROM
      page_slider
    WHERE 1 = 1
    AND page_version_id = ?
  `,
    dbPageVersion.getInt("id")
  );

  dbSliders.forEach((dbSlider) => {
    _db.execute(
      `
      DELETE FROM page_slider_item
      WHERE page_slider_id = ?
    `,
      dbSlider.getInt("id")
    );
  });

  _db.execute(
    `
    DELETE FROM page_slider
    WHERE page_version_id = ?
  `,
    dbPageVersion.getInt("id")
  );

  _db.execute(
    `
    DELETE FROM page_version
    WHERE id = ?
  `,
    dbPageVersion.getInt("id")
  );

  _out.json(_val.map().set("result", true));
} else {
  _out.json(_val.map().set("result", false).set("error", "not-found"));
}
