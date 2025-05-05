// _core : cluar/main

const version = _req.getString("version");

const dbPageVersion = _db.get("page_version", version);

if (dbPageVersion) {
  const structure = _val.list();

  /*
   *
   *  CONTENTS
   *
   */
  const dbContents = _db.query(`
    SELECT
      content.id,
      content.uid,
      page_content_type.code "type",
      content.title,
      content.content,
      content.image,
      content.image_alt,
      content.image_title,
      content.image_max_width,
      content.sorter
    FROM page_content content
      INNER JOIN page_content_type ON content.type_id = page_content_type.id
    WHERE content.active = TRUE
      AND page_content_type.active = TRUE
      AND content.active = TRUE
      AND content.page_version_id = ${dbPageVersion.getInt("id")}
  `);

  for (const dbContent of dbContents) {
    structure.add(
      _val
        .map()
        .set("uid", dbContent.getString("uid"))
        .set("section", "content")
        .set("type", dbContent.getString("type"))
        .set("title", dbContent.getString("title"))
        .set("content", dbContent.getString("content"))
        .set("image", dbContent.getString("image"))
        .set("image_alt", dbContent.getString("image_alt"))
        .set("image_title", dbContent.getString("image_title"))
        .set("image_max_width", dbContent.getString("image_max_width"))
        .set("sorter", dbContent.getInt("sorter"))
        .set("actions", cluar.actions("content", dbContent.getInt("id")))
    );
    // if (settings.images === true) {
    //   cluar.publishImage("content", dbContent.getString("image"));
    // }
  }

  /*
   *
   *  BANNERS
   *
   */
  const dbBanners = _db.query(`
    SELECT
      banner.id,
      banner.uid,
      page_banner_type.code "type",
      banner.title,
      banner.content,
      banner.image,
      banner.image_alt,
      banner.image_title,
      banner.position_x,
      banner.position_y,
      banner.sorter
    FROM page_banner banner
      INNER JOIN page_banner_type ON banner.type_id = page_banner_type.id
    WHERE banner.active = TRUE
      AND page_banner_type.active = TRUE
      AND banner.active = TRUE
      AND banner.page_version_id = ${dbPageVersion.getInt("id")}
  `);

  for (const dbBanner of dbBanners) {
    structure.add(
      _val
        .map()
        .set("uid", dbBanner.getString("uid"))
        .set("section", "banner")
        .set("type", dbBanner.getString("type"))
        .set("title", dbBanner.getString("title"))
        .set("content", dbBanner.getString("content"))
        .set("image", dbBanner.getString("image"))
        .set("image_alt", dbBanner.getString("image_alt"))
        .set("image_title", dbBanner.getString("image_title"))
        .set("sorter", dbBanner.getInt("sorter"))
        .set(
          "position",
          _val
            .map()
            .set("x", dbBanner.getString("position_x"))
            .set("y", dbBanner.getString("position_y"))
        )
        .set("actions", cluar.actions("banner", dbBanner.getInt("id")))
    );

    // if (settings.images === true) {
    //   cluar.publishImage("banner", dbBanner.getString("image"));
    // }
  }

  /*
   *
   *  LISTING
   *
   */
  const dbListings = _db.query(`
    SELECT
      listing.id,
      listing.uid,
      page_listing_type.code "type",
      listing.title,
      listing.image_alt,
      listing.image_title,
      listing.content,
      listing.image,
      listing.sorter
    FROM page_listing listing
      INNER JOIN page_listing_type ON listing.type_id = page_listing_type.id
    WHERE listing.active = TRUE
      AND page_listing_type.active = TRUE
      AND listing.active = TRUE
      AND listing.page_version_id = ${dbPageVersion.getInt("id")}
  `);

  for (const dbListing of dbListings) {
    const items = _val.list();
    const dbItems = _db.query(`
      SELECT
          uid, title, content, image, image_alt, image_title, sorter, link
      FROM listing_item
      WHERE listing_id = ${dbListing.getInt("id")} AND active = TRUE
      `);

    for (const dbItem of dbItems) {
      items.add(
        _val
          .map()
          .set("uid", dbItem.getString("uid"))
          .set("section", "listing_item")
          .set("title", dbItem.getString("title"))
          .set("content", dbItem.getString("content"))
          .set("image", dbItem.getString("image"))
          .set("image_alt", dbItem.getString("image_alt"))
          .set("image_title", dbItem.getString("image_title"))
          .set("sorter", dbItem.getInt("sorter"))
          .set("link", dbItem.getString("link"))
      );

      // if (settings.images === true) {
      //   cluar.publishImage("listing_item", dbItem.getString("image"));
      // }
    }

    structure.add(
      _val
        .map()
        .set("uid", dbListing.getString("uid"))
        .set("section", "listing")
        .set("type", dbListing.getString("type"))
        .set("title", dbListing.getString("title"))
        .set("content", dbListing.getString("content"))
        .set("image", dbListing.getString("image"))
        .set("image_alt", dbListing.getString("image_alt"))
        .set("image_title", dbListing.getString("image_title"))
        .set("items", items)
        .set("sorter", dbListing.getInt("sorter"))
    );

    // if (settings.images === true) {
    //   cluar.publishImage("listing", dbListing.getString("image"));
    // }
  }

  /*
   *
   *  FUNCTIONALITY
   *
   */
  const dbFunctionalities = _db.query(`
    SELECT
      functionality.id,
      functionality.uid,
      page_functionality_type.code "type",
      functionality.title,
      functionality.content,
      functionality.image,
      functionality.sorter
    FROM page_functionality functionality
      INNER JOIN page_functionality_type ON functionality.type_id = page_functionality_type.id
    WHERE functionality.active = TRUE
      AND page_functionality_type.active = TRUE
      AND functionality.active = TRUE
      AND functionality.page_version_id = ${dbPageVersion.getInt("id")}
  `);

  for (const dbFunctionality of dbFunctionalities) {
    structure.add(
      _val
        .map()
        .set("uid", dbFunctionality.getString("uid"))
        .set("section", "functionality")
        .set("type", dbFunctionality.getString("type"))
        .set("title", dbFunctionality.getString("title"))
        .set("content", dbFunctionality.getString("content"))
        .set("image", dbFunctionality.getString("image"))
        .set("sorter", dbFunctionality.getInt("sorter"))
    );

    // if (settings.images === true) {
    //   cluar.publishImage("functionality", dbFunctionality.getString("image"));
    // }
  }

  structure.sort((a, b) => a.getInt("sorter") - b.getInt("sorter"));

  _out.json(_val.map().set("result", true).set("structure", structure));
}
