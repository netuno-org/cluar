// _core: cluar/main

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
  const imagesToPublish = {
    banner: [],
    content: [],
    listing: [],
    listing_item: [],
    functionality: [],
    slider_item: [],
  };

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
    const structuresToPublishImages = imagesToPublish[sectionType];
    let image = null;

    if (
      structure.getString("image") !== "" &&
      structure.getString("image")?.includes("base64")
    ) {
      image = structure.getFile("image");
    }

    if (sectionType === "banner") {
      _log.info(sectionType, structure.getString("type"));
      const bannerActions = structure.getList("actions", _val.list());
      const newSectionType = _db.queryFirst(`
        SELECT
          *
        FROM
          page_banner_type
        WHERE code = '${structure.getString("type")}'
      `);
      const bannerData = _val
        .map()
        .set("title", structure.getString("title"))
        .set("content", structure.getString("content"))
        .set("type_id", newSectionType.getInt("id"))
        .set("page_version_id", newPageVersion)
        .set("image_title", structure.getString("image_title"))
        .set("image_alt", structure.getString("image_alt"))
        .set("sorter", structure.getInt("sorter", 0));

      if (structure.getString("image")?.includes("base64")) {
        bannerData.set("image", image);
      } else if (structure.getString("image")) {
        const imageFile = _storage
          .database("page_banner", "image", structure.getString("image"))
          .file();
        if (imageFile.exists()) {
          bannerData.set("image", imageFile);
        }
      }

      const bannerId = _db.insert("page_banner", bannerData);

      if (structure.getString("image")) {
        structuresToPublishImages.push(bannerId);
      }

      for (const action of bannerActions) {
        const dbAction = _db.get("action", action.getString("uid"));

        if (dbAction) {
          _db.insert(
            "page_banner_action",
            _val
              .map()
              .set("page_banner_id", bannerId)
              .set("action_id", dbAction.getInt("id"))
              .set("sorter", action.getInt("sorter", 0))
          );
        }
      }
    } else if (sectionType === "content") {
      _log.info(sectionType, structure.getString("type"));
      const contentActions = structure.getList("actions", _val.list());
      const newSectionType = _db.queryFirst(`
        SELECT
          *
        FROM
          page_content_type
        WHERE code = '${structure.getString("type")}'
      `);
      const contentData = _val
        .map()
        .set("title", structure.getString("title"))
        .set("content", structure.getString("content"))
        .set("type_id", newSectionType.getInt("id"))
        .set("page_version_id", newPageVersion)
        .set("image_title", structure.getString("image_title"))
        .set("image_alt", structure.getString("image_alt"))
        .set("sorter", structure.getString("sorter"));

      if (structure.getString("image")?.includes("base64")) {
        contentData.set("image", image);
      } else if (structure.getString("image")) {
        const imageFile = _storage
          .database("page_content", "image", structure.getString("image"))
          .file();
        if (imageFile.exists()) {
          contentData.set("image", imageFile);
        }
      }

      const contentId = _db.insert("page_content", contentData);

      if (structure.getString("image")) {
        structuresToPublishImages.push(contentId);
      }

      for (const action of contentActions) {
        const dbAction = _db.get("action", action.getString("uid"));

        if (dbAction) {
          _db.insert(
            "page_content_action",
            _val
              .map()
              .set("page_content_id", contentId)
              .set("action_id", dbAction.getInt("id"))
              .set("sorter", action.getInt("sorter"))
          );
        }
      }
    } else if (sectionType === "listing") {
      const listingItems = structure.getList("items", _val.list());
      const listingType = _db.queryFirst(`
        SELECT
          *
        FROM
          page_listing_type
        WHERE code = '${structure.getString("type")}'
      `);
      const listingData = _val
        .map()
        .set("page_version_id", newPageVersion)
        .set("title", structure.getString("title"))
        .set("sorter", structure.getInt("sorter", 0))
        .set("image_title", structure.getString("image_title"))
        .set("image_alt", structure.getString("image_alt"))
        .set("type_id", listingType.getInt("id"))
        .set("content", structure.getString("content"));

      if (structure.getString("type")) {
        _log.info(sectionType, structure.getString("type"));
        const dbListingType = _db.queryFirst(
          `
            SELECT
              *
            FROM page_listing_type
            WHERE code = ?
          `,
          structure.getString("type")
        );

        if (dbListingType) {
          listingData.set("type_id", dbListingType.getInt("id"));
        }
      }

      if (structure.getString("image")?.includes("base64")) {
        listingData.set("image", image);
      } else if (structure.getString("image")) {
        const imageFile = _storage
          .database("page_listing", "image", structure.getString("image"))
          .file();
        if (imageFile.exists()) {
          listingData.set("image", imageFile);
        }
      }

      const listingId = _db.insert("page_listing", listingData);

      if (structure.getString("image")) {
        structuresToPublishImages.push(listingId);
      }

      for (const listingItem of listingItems) {
        let listingItemImage = null;

        if (
          listingItem.getString("image") !== "" &&
          listingItem.getString("image")?.includes("base64")
        ) {
          listingItemImage = listingItem.getFile("image");
        }

        const listingItemData = _val
          .map()
          .set("page_listing_id", listingId)
          .set("title", listingItem.getString("title"))
          .set("content", listingItem.getString("content"))
          .set("link", listingItem.getString("link"))
          .set("sorter", listingItem.getString("sorter"))
          .set("image_title", listingItem.getString("image_title"))
          .set("image_alt", listingItem.getString("image_alt"));

        if (listingItem.getString("image")?.includes("base64")) {
          listingItemData.set("image", listingItemImage);
        } else if (listingItem.getString("image")) {
          const imageFile = _storage
            .database(
              "page_listing_item",
              "image",
              listingItem.getString("image")
            )
            .file();
          if (imageFile.exists()) {
            listingItemData.set("image", imageFile);
          }
        }

        const listingItemId = _db.insert("page_listing_item", listingItemData);

        if (listingItem.getString("image")) {
          imagesToPublish["listing_item"].push(listingItemId);
        }
      }
    } else if (sectionType === "slider") {
      const sliderItems = structure.getList("items", _val.list());
      const sliderType = _db.queryFirst(`
        SELECT
          *
        FROM
          page_slider_type
        WHERE code = '${structure.getString("type")}'
      `);

      const sliderData = _val
        .map()
        .set("page_version_id", newPageVersion)
        .set("title", structure.getString("title"))
        .set("sorter", structure.getInt("sorter", 0))
        .set("type_id", sliderType.getInt("id"))
        .set("content", structure.getString("content"));

      if (structure.getString("type")) {
        _log.info(sectionType, structure.getString("type"));
        const dbSliderType = _db.queryFirst(
          `
            SELECT
              *
            FROM page_slider_type
            WHERE code = ?
          `,
          structure.getString("type")
        );

        if (dbSliderType) {
          sliderData.set("type_id", dbSliderType.getInt("id"));
        }
      }

      const sliderId = _db.insert("page_slider", sliderData);

      for (const sliderItem of sliderItems) {
        let sliderItemImage = null;

        if (
          sliderItem.getString("image") !== "" &&
          sliderItem.getString("image")?.includes("base64")
        ) {
          sliderItemImage = sliderItem.getFile("image");
        }

        const sliderItemData = _val
          .map()
          .set("page_slider_id", sliderId)
          .set("title", sliderItem.getString("title"))
          .set("content", sliderItem.getString("content"))
          .set("sorter", sliderItem.getString("sorter"))
          .set("image_title", sliderItem.getString("image_title"))
          .set("image_alt", sliderItem.getString("image_alt"));

        if (sliderItem.getString("image")?.includes("base64")) {
          sliderItemData.set("image", sliderItemImage);
        } else if (sliderItem.getString("image")) {
          const imageFile = _storage
            .database(
              "page_slider_item",
              "image",
              sliderItem.getString("image")
            )
            .file();
          if (imageFile.exists()) {
            sliderItemData.set("image", imageFile);
          }
        }

        const sliderItemId = _db.insert("page_slider_item", sliderItemData);

        if (sliderItem.getString("image")) {
          imagesToPublish["slider_item"].push(sliderItemId);
        }
      }
    } else if (sectionType === "functionality") {
      _log.info(sectionType, structure.getString("type"));
      const dbFunctionalityType = _db.queryFirst(
        `
          SELECT
            *
          FROM page_functionality_type
          WHERE code = ?
        `,
        structure.getString("type")
      );

      if (dbFunctionalityType) {
        const functionalityData = _val
          .map()
          .set("page_version_id", newPageVersion)
          .set("type_id", dbFunctionalityType.getInt("id"))
          .set("title", structure.getString("title"))
          .set("content", structure.getString("content"))
          .set("sorter", structure.getInt("sorter", 0));

        if (image) {
          functionalityData.set("image", image);
        }

        const functionlityId = _db.insert(
          "page_functionality",
          functionalityData
        );

        if (image) {
          structuresToPublishImages.push(functionlityId);
        }
      }
    }

    /*if (status === "to_create") {

    } else if (status === "to_update") {
      
    }*/
  }

  for (const key in imagesToPublish) {
    const structuresIdsToPublishImages = imagesToPublish[key];

    if (structuresIdsToPublishImages.length == 0) {
      continue;
    }

    const dbStructures = _db.query(
      `
        SELECT
          *
        FROM page_${key}
        WHERE id IN (${structuresIdsToPublishImages.map(() => "?").join(",")})
      `,
      structuresIdsToPublishImages
    );

    for (const dbStructure of dbStructures) {
      cluar.publishImage(`page_${key}`, dbStructure.getString("image"));
    }
  }

  const newPageVersionUID = _db.get("page_version", newPageVersion);

  _out.json(
    _val.map().set("result", true).set("data", newPageVersionUID.get("uid"))
  );
} else {
  _header.status(409);
  _out.json(_val.map().set("error", "page-has-no-previous-version"));
}
