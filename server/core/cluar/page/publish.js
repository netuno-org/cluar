cluar.page.publish = (dbPage) => {
  const settings = { images: true }

  const structure = _val.list()

  /*
   *
   *  CONTENTS
   *
   */
  const dbContents = _db.query(`
            SELECT
                content.id,
                content.uid,
                content_type.code "type",
                content.title,
                content.content,
                content.image,
                content.image_alt,
                content.image_title,
                content.image_max_width,
                page_content.sorter
            FROM content
                INNER JOIN content_type ON content.type_id = content_type.id
                INNER JOIN page_content ON page_content.content_id = content.id
            WHERE content.active = TRUE
                AND content_type.active = TRUE
                AND page_content.active = TRUE
                AND page_content.page_id = ${dbPage.getInt("id")}
            `)
  for (const dbContent of dbContents) {
    structure.add(
      _val.map()
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
    )
    if (settings.images === true) {
      cluar.publishImage("content", dbContent.getString("image"))
    }
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
                banner_type.code "type",
                banner.title,
                banner.content,
                banner.image,
                banner.image_alt,
                banner.image_title,
                banner.position_x,
                banner.position_y,
                page_banner.sorter
            FROM banner
                INNER JOIN banner_type ON banner.type_id = banner_type.id
                INNER JOIN page_banner ON page_banner.banner_id = banner.id
            WHERE banner.active = TRUE
                AND banner_type.active = TRUE
                AND page_banner.active = TRUE
                AND page_banner.page_id = ${dbPage.getInt("id")}
            `)
  for (const dbBanner of dbBanners) {
    structure.add(
      _val.map()
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
          _val.map()
            .set("x", dbBanner.getString("position_x"))
            .set("y", dbBanner.getString("position_y"))
        )
        .set("actions", cluar.actions("banner", dbBanner.getInt("id")))
    )
    if (settings.images === true) {
      cluar.publishImage("banner", dbBanner.getString("image"))
    }
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
                listing_type.code "type",
                listing.title,
                listing.image_alt,
                listing.image_title,
                listing.content,
                listing.image,
                page_listing.sorter
            FROM listing
                INNER JOIN listing_type ON listing.type_id = listing_type.id
                INNER JOIN page_listing ON page_listing.listing_id = listing.id
            WHERE listing.active = TRUE
                AND listing_type.active = TRUE
                AND page_listing.active = TRUE
                AND page_listing.page_id = ${dbPage.getInt("id")}
            `)
  for (const dbListing of dbListings) {
    const items = _val.list()
    const dbItems = _db.query(`
                SELECT
                    uid, title, content, image, image_alt, image_title, sorter, link
                FROM listing_item
                WHERE listing_id = ${dbListing.getInt("id")} AND active = TRUE
                `)
    for (const dbItem of dbItems) {
      items.add(
        _val.map()
          .set("uid", dbItem.getString("uid"))
          .set("section", "listing_item")
          .set("title", dbItem.getString("title"))
          .set("content", dbItem.getString("content"))
          .set("image", dbItem.getString("image"))
          .set("image_alt", dbItem.getString("image_alt"))
          .set("image_title", dbItem.getString("image_title"))
          .set("sorter", dbItem.getInt("sorter"))
          .set("link", dbItem.getString("link"))
      )
      if (settings.images === true) {
        cluar.publishImage("listing_item", dbItem.getString("image"))
      }
    }
    structure.add(
      _val.map()
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
    )
    if (settings.images === true) {
      cluar.publishImage("listing", dbListing.getString("image"))
    }
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
                functionality_type.code "type",
                functionality.title,
                functionality.content,
                functionality.image,
                page_functionality.sorter
            FROM functionality
                INNER JOIN functionality_type ON functionality.type_id = functionality_type.id
                INNER JOIN page_functionality ON page_functionality.functionality_id = functionality.id
            WHERE functionality.active = TRUE
                AND functionality_type.active = TRUE
                AND page_functionality.active = TRUE
                AND page_functionality.page_id = ${dbPage.getInt("id")}
            `)
  for (const dbFunctionality of dbFunctionalities) {
    structure.add(
      _val.map()
        .set("uid", dbFunctionality.getString("uid"))
        .set("section", "functionality")
        .set("type", dbFunctionality.getString("type"))
        .set("title", dbFunctionality.getString("title"))
        .set("content", dbFunctionality.getString("content"))
        .set("image", dbFunctionality.getString("image"))
        .set("sorter", dbFunctionality.getInt("sorter"))
    )
    if (settings.images === true) {
      cluar.publishImage("functionality", dbFunctionality.getString("image"))
    }
  }

  structure.sort((a, b) => a.getInt("sorter") - b.getInt("sorter"))

  const folder = _app.folder(`${cluar.base()}/cluar/structures`)
  if (!folder.exists()) {
    folder.mkdir()
  }

  const file = _app.file(`${cluar.base()}/cluar/structures/${dbPage.getString("uid")}.json`)
  file.output().print(`${structure.toJSON(4)}`).close()

  let currentLanguage = _db.get("language", dbPage.getInt("language_id"))

  if (currentLanguage) {
    currentLanguage = currentLanguage.getString("code")
  } else {
    currentLanguage = dbPage.getString("language")
  }

  const htmlContent = _template.getOutput('cluar/builder',
    {
      structure,
      configuration: cluar.base.configuration(),
      dictionary: cluar.base.dictionary(),
      languages: cluar.base.languages(),
      currentLanguage,
      pages: cluar.base.pages({}),
      page: dbPage,
    }
  );

  if (!_env.is("dev")) {
    const basePath = `/website/dist`;
    const locale = _db.queryFirst(`SELECT * FROM language WHERE code = ?`, dbPage.getString("language")).getString("locale");
    const fullPath = `${basePath}/${locale}` + dbPage.getString("link");
    const HTMLIndexFile = _app.file(`${basePath}/index.html`);

    if (HTMLIndexFile.exists()) {
      const websiteConfig = _app.settings().getValues("cluar").getValues("website") || _val.map()
      const HTMLIndexDocument = _html.parse(HTMLIndexFile, "US-ASCII", "");
      const headElement = HTMLIndexDocument.select("head").first();
      const bodyElement = HTMLIndexDocument.select("body").first();

      if (headElement && bodyElement) {
        if (dbPage.getString("social_image") != "") {
          /**
           * PUBLISH SOCIAL IMAGE IN PRODUCTION
           */
          cluar.publishSocialImage(dbPage.getString("social_image"));
        }

        headElement.prepend(`<meta property="og:title" content="${dbPage.getString("title")}" />`);
        headElement.prepend(`<meta property="og:description" content="${dbPage.getString("social_description", "")}" />`);
        headElement.prepend(`<meta property="og:image" content="images/${dbPage.getString("social_image", "")}"/>`);
        headElement.prepend(`<meta property="og:site_name" content="${websiteConfig.getString("name", "")}" />`);
        headElement.prepend(`<meta property="og:url" content="${websiteConfig.getString("url", "") + dbPage.getString("link")}" />`);
        bodyElement.prepend(htmlContent);

        const folder = _app.folder(fullPath);
        if (!folder.exists()) {
          folder.mkdirs();
        }

        const finalFile = _app.file(`${fullPath}/index.html`);
        finalFile.output().printAndClose(HTMLIndexDocument.html());
      }
    }
  }
}
