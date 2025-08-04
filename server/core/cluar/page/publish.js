cluar.page.publish = (dbPage) => {
  //_log.debug("publish", dbPage);
  const dbPageStatus = _db.queryFirst(`
    SELECT * FROM page_status WHERE page_status.code = 'published'
  `);

  const dbPageVersion = _db.queryFirst(`
    SELECT
      *
    FROM
      page_version pv
    WHERE
      pv.status_id = ${dbPageStatus.getInt("id")}
        AND pv.page_id = ${dbPage.getInt("id")}
  `);

  if (dbPageVersion) {
    dbPage
      .set("page_version_id", dbPageVersion.getInt("id"))
      .set("page_version_uid", dbPageVersion.getString("uid"));
  }

  const settings = { images: true };

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
                content.title,
                content.content,
                content.image,
                content.image_alt,
                content.image_title,
                content.image_max_width,
                content.sorter,
                content.type
            FROM page_content content
            WHERE content.active = TRUE
                AND content.active = TRUE
                AND content.page_version_id = ${dbPage.getInt(
    "page_version_id"
  )}
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
                AND banner.page_version_id = ${dbPage.getInt("page_version_id")}
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
    if (settings.images === true) {
      cluar.publishImage("banner", dbBanner.getString("image"));
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
                listing.type,
                listing.title,
                listing.image_alt,
                listing.image_title,
                listing.content,
                listing.image,
                listing.sorter
            FROM page_listing listing
            WHERE listing.active = TRUE
                AND listing.active = TRUE
                AND listing.page_version_id = ${dbPage.getInt(
    "page_version_id"
  )}
            `);
  for (const dbListing of dbListings) {
    const items = _val.list();
    const dbItems = _db.query(`
                SELECT
                    uid, title, content, image, image_alt, image_title, sorter, link
                FROM page_listing_item
                WHERE page_listing_id = ${dbListing.getInt(
      "id"
    )} AND active = TRUE
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
  }

  /*
   *
   *  SLIDERS
   *
   */
  const dbSliders = _db.query(`
            SELECT
                slider.id,
                slider.uid,
                slider.type,
                slider.title,
                slider.image_alt,
                slider.image_title,
                slider.content,
                slider.image,
                slider.sorter
            FROM page_slider slider
            WHERE slider.active = TRUE
                AND slider.active = TRUE
                AND slider.page_version_id = ${dbPage.getInt("page_version_id")}
            `);
  for (const dbSlider of dbSliders) {
    const items = _val.list();
    const dbItems = _db.query(`
                SELECT
                    uid, title, content, image, image_alt, image_title, sorter
                FROM page_slider_item
                WHERE page_slider_id = ${dbSlider.getInt(
      "id"
    )} AND active = TRUE
                `);

    for (const dbItem of dbItems) {
      items.add(
        _val
          .map()
          .set("uid", dbItem.getString("uid"))
          .set("section", "slider_item")
          .set("title", dbItem.getString("title"))
          .set("content", dbItem.getString("content"))
          .set("image", dbItem.getString("image"))
          .set("image_alt", dbItem.getString("image_alt"))
          .set("image_title", dbItem.getString("image_title"))
          .set("sorter", dbItem.getInt("sorter"))
      );
    }
    structure.add(
      _val
        .map()
        .set("uid", dbSlider.getString("uid"))
        .set("section", "slider")
        .set("type", dbSlider.getString("type"))
        .set("title", dbSlider.getString("title"))
        .set("content", dbSlider.getString("content"))
        .set("image", dbSlider.getString("image"))
        .set("image_alt", dbSlider.getString("image_alt"))
        .set("image_title", dbSlider.getString("image_title"))
        .set("items", items)
        .set("sorter", dbSlider.getInt("sorter"))
    );
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
                functionality.type,
                functionality.title,
                functionality.content,
                functionality.image,
                functionality.sorter
            FROM page_functionality functionality
            WHERE functionality.active = TRUE
                AND functionality.active = TRUE
                AND functionality.page_version_id = ${dbPage.getInt(
    "page_version_id"
  )}
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
  }

  structure.sort((a, b) => a.getInt("sorter") - b.getInt("sorter"));

  const folder = _app.folder(`${cluar.base()}/cluar/structures`);
  if (!folder.exists()) {
    folder.mkdir();
  }

  //_log.debug("structure", structure);

  const file = _app.file(
    `${cluar.base()}/cluar/structures/${dbPage.getString("uid")}.json`
  );
  file
    .output()
    .print(`${structure.toJSON(4)}`)
    .close();

  let currentLanguage = _db.get("language", dbPage.getInt("language_id"));

  if (currentLanguage) {
    currentLanguage = currentLanguage.getString("code");
  } else {
    currentLanguage = dbPage.getString("language");
  }

  const htmlContent = _template.getOutput("cluar/builder", {
    structure,
    configuration: cluar.base.configuration(),
    dictionary: cluar.base.dictionary(),
    languages: cluar.base.languages(),
    currentLanguage,
    pages: cluar.base.pages({}),
    page: dbPage,
  });

  if (dbPage.getString("social_image") != "") {
    /**
     * PUBLISH SOCIAL IMAGE IN PRODUCTION
     */
    cluar.publishPageSocialImage(dbPage.getString("social_image"));
  }

  if (!_env.is("dev")) {
    const basePath = `/website/dist`;
    const locale = _db
      .queryFirst(
        `SELECT * FROM language WHERE code = ?`,
        dbPage.getString("language")
      )
      .getString("locale");
    const fullPath = `${basePath}/${locale}` + dbPage.getString("link");
    const HTMLIndexFile = _app.file(`${basePath}/index.html`);

    if (HTMLIndexFile.exists()) {
      const websiteConfig =
        _app.settings().getValues("cluar").getValues("website") || _val.map();
      const HTMLIndexDocument = _html.parse(HTMLIndexFile, "US-ASCII", "");
      const headElement = HTMLIndexDocument.select("head").first();
      const bodyElement = HTMLIndexDocument.select("body").first();

      if (headElement && bodyElement) {
        const removeNewLineRegex = /(\r\n|\r|\n)/g;

        const pageTitle = dbPage.getString("title");
        const documentTitle = headElement.selectFirst("title");
        if (documentTitle) {
          documentTitle.text(pageTitle);
        } else {
          headElement.appendElement("title").text(pageTitle);
        }

        const pageKeywords = dbPage
          .getString("keywords")
          .replaceAll(removeNewLineRegex, "");
        const metaKeywordsElement = headElement.selectFirst("[name=keywords]");
        if (metaKeywordsElement) {
          metaKeywordsElement.attr("content", pageKeywords);
        } else {
          headElement.prependElement(
            `<meta name="keywords" content="${pageKeywords}" />`
          );
        }

        const pageDescription = dbPage
          .getString("description")
          .replaceAll(removeNewLineRegex, "");
        const metaDescriptionElement =
          headElement.selectFirst("[name=description]");
        if (metaDescriptionElement) {
          metaDescriptionElement.attr("content", pageDescription);
        } else {
          headElement.prependElement(
            `<meta name="description" content="${pageDescription}" />`
          );
        }

        headElement.prepend(
          `<meta property="og:title" content="${pageTitle}" />`
        );
        headElement.prepend(
          `<meta property="og:description" content="${dbPage.getString(
            "social_description",
            ""
          )}" />`
        );
        headElement.prepend(
          `<meta property="og:image" content="/cluar/images/page/${dbPage.getString(
            "social_image",
            ""
          )}"/>`
        );
        headElement.prepend(
          `<meta property="og:site_name" content="${websiteConfig.getString(
            "name",
            ""
          )}" />`
        );
        headElement.prepend(
          `<meta property="og:url" content="${websiteConfig.getString("url", "") + dbPage.getString("link")
          }" />`
        );
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
