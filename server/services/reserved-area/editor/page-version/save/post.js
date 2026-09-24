import { _db, _val, _req, _out, _storage } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const page = _req.getString("page");
const structures = _req.get("structures");

const lastPageVersion = _db.queryFirst(`
  SELECT
    p.id,
    p.language_id,
    pv.version
  FROM
    page_version pv
  INNER JOIN page p ON p.id = pv.page_id
  WHERE p.uid = '${page}'
  ORDER BY pv.version DESC
`);

const languageId = lastPageVersion.getInt("language_id");

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
      .set("language_id", languageId)
      .set("version", lastPageVersion.getInt("version") + 1)
      .set("status_id", draftStatus.getInt("id"))
      .set("created_at", _db.timestamp()),
  );

  const structuresToProcess = [];
  for (const structure of structures) {
    structuresToProcess.push(structure);
  }

  for (const structure of structuresToProcess) {
    const status = structure.getString("status");
    const sectionType = structure.getString("section");
    const pageRowColId = structure.getInt("page_row_col_id", 0);

    if (status === "to_remove") {
      continue;
    }

    const structuresToPublishImages = imagesToPublish[sectionType];
    let image = null;

    if (
      structure.getString("image") !== "" &&
      structure.getString("image")?.includes("base64")
    ) {
      image = structure.getFile("image");
    }

    if (sectionType === "row") {
      const rowData = _val
        .map()
        .set("title", structure.getString("title"))
        .set("page_version_id", newPageVersion)
        .set("content", structure.getString("content"))
        .set("type", structure.getString("type"))
        .set("sorter", structure.getInt("sorter", 0));

      if (pageRowColId) {
        rowData.set("page_row_col_id", pageRowColId);
      }

      const rowId = _db.insert("page_row", rowData);
      const rowItems = structure.getList("items", _val.list());

      for (const rowItem of rowItems) {
        const rowColumnId = _db.insert(
          "page_row_col",
          _val
            .map()
            .set("page_row_id", rowId)
            .set("title", rowItem.getString("title"))
            .set("span", rowItem.getInt("span", -1))
            .set("xs", rowItem.getInt("xs", -1))
            .set("sm", rowItem.getInt("sm", -1))
            .set("md", rowItem.getInt("md", -1))
            .set("lg", rowItem.getInt("lg", -1))
            .set("xl", rowItem.getInt("xl", -1))
            .set("xxl", rowItem.getInt("xxl", -1))
            .set("xxxl", rowItem.getInt("xxxl", -1)),
        );

        const childSection = rowItem.get("section");
        if (childSection && typeof childSection.getString === "function") {
          childSection.set("page_row_col_id", rowColumnId);
          structuresToProcess.push(childSection);
        }
      }
    } else if (sectionType === "banner") {
      const bannerActions = structure.getList("action_uids", _val.list());
      const bannerData = _val
        .map()
        .set("title", structure.getString("title"))
        .set("content", structure.getString("content"))
        .set("type", structure.getString("type"))
        .set("page_version_id", newPageVersion)
        .set("image_title", structure.getString("image_title"))
        .set("image_alt", structure.getString("image_alt"))
        .set("language_id", languageId)
        .set(
          "title_invert_background",
          structure.getBoolean("title_invert_background"),
        )
        .set(
          "content_invert_background",
          structure.getBoolean("content_invert_background"),
        )
        .set("sorter", structure.getInt("sorter", 0))
        .set("html_content", structure.getString("html_content"))
        .set("edit_mode", structure.getString("edit_mode") || "visual");

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

      if (pageRowColId) {
        bannerData.set("page_row_col_id", pageRowColId);
      }

      const bannerId = _db.insert("page_banner", bannerData);

      if (structure.getString("image")) {
        structuresToPublishImages.push(bannerId);
      }
      let actionSorter = 10;
      for (const action of bannerActions) {
        const dbAction = _db.get("action", action);

        if (dbAction) {
          _db.insert(
            "page_banner_action",
            _val
              .map()
              .set("page_banner_id", bannerId)
              .set("action_id", dbAction.getInt("id"))
              .set("sorter", actionSorter),
          );
          actionSorter += 10;
        }
      }
    } else if (sectionType === "content") {
      const contentActions = structure.getList("action_uids", _val.list());

      const contentData = _val
        .map()
        .set("title", structure.getString("title"))
        .set("content", structure.getString("content"))
        .set("type", structure.getString("type"))
        .set("page_version_id", newPageVersion)
        .set("image_title", structure.getString("image_title"))
        .set("image_alt", structure.getString("image_alt"))
        .set("language_id", languageId)
        .set(
          "title_invert_background",
          structure.getBoolean("title_invert_background"),
        )
        .set(
          "content_invert_background",
          structure.getBoolean("content_invert_background"),
        )
        .set("sorter", structure.getString("sorter"))
        .set("html_content", structure.getString("html_content"))
        .set("edit_mode", structure.getString("edit_mode") || "visual");

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

      if (pageRowColId) {
        contentData.set("page_row_col_id", pageRowColId);
      }

      const contentId = _db.insert("page_content", contentData);

      if (structure.getString("image")) {
        structuresToPublishImages.push(contentId);
      }

      let actionSorter = 10;
      for (const action of contentActions) {
        const dbAction = _db.get("action", action);

        if (dbAction) {
          _db.insert(
            "page_content_action",
            _val
              .map()
              .set("page_content_id", contentId)
              .set("action_id", dbAction.getInt("id"))
              .set("sorter", actionSorter),
          );
          actionSorter += 10;
        }
      }
    } else if (sectionType === "listing") {
      const listingItems = structure.getList("items", _val.list());

      const listingActions = structure.getList("action_uids", _val.list());
      const listingData = _val
        .map()
        .set("page_version_id", newPageVersion)
        .set("title", structure.getString("title"))
        .set("sorter", structure.getInt("sorter", 0))
        .set("image_title", structure.getString("image_title"))
        .set("image_alt", structure.getString("image_alt"))
        .set("type", structure.getString("type"))
        .set("language_id", languageId)
        .set(
          "title_invert_background",
          structure.getBoolean("title_invert_background"),
        )
        .set(
          "content_invert_background",
          structure.getBoolean("content_invert_background"),
        )
        .set("content", structure.getString("content"))
        .set("html_content", structure.getString("html_content"))
        .set("edit_mode", structure.getString("edit_mode") || "visual");

      // if (structure.getString("type")) {
      //   const dbListingType = _db.queryFirst(
      //     `
      //       SELECT
      //         *
      //       FROM page_listing_type
      //       WHERE code = ?
      //     `,
      //     structure.getString("type")
      //   );

      //   if (dbListingType) {
      //     listingData.set("type_id", dbListingType.getInt("id"));
      //   }
      // }

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

      if (pageRowColId) {
        listingData.set("page_row_col_id", pageRowColId);
      }

      const listingId = _db.insert("page_listing", listingData);

      if (structure.getString("image")) {
        structuresToPublishImages.push(listingId);
      }

      let actionSorter = 10;
      for (const action of listingActions) {
        const dbAction = _db.get("action", action);
        if (dbAction) {
          _db.insert(
            "page_listing_action",
            _val
              .map()
              .set("page_listing_id", listingId)
              .set("action_id", dbAction.getInt("id"))
              .set("sorter", actionSorter),
          );
          actionSorter += 10;
        }
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
          .set(
            "title_invert_background",
            listingItem.getBoolean("title_invert_background"),
          )
          .set(
            "content_invert_background",
            listingItem.getBoolean("content_invert_background"),
          )
          .set("image_alt", listingItem.getString("image_alt"))
          .set("html_content", listingItem.getString("html_content"))
          .set("edit_mode", listingItem.getString("edit_mode") || "visual");

        if (listingItem.getString("image")?.includes("base64")) {
          listingItemData.set("image", listingItemImage);
        } else if (listingItem.getString("image")) {
          const imageFile = _storage
            .database(
              "page_listing_item",
              "image",
              listingItem.getString("image"),
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

      const sliderData = _val
        .map()
        .set("page_version_id", newPageVersion)
        .set("title", structure.getString("title"))
        .set("sorter", structure.getInt("sorter", 0))
        .set("type", structure.getString("type"))
        .set("language_id", languageId)
        .set(
          "title_invert_background",
          structure.getBoolean("title_invert_background"),
        )
        .set(
          "content_invert_background",
          structure.getBoolean("content_invert_background"),
        )
        .set("content", structure.getString("content"))
        .set("html_content", structure.getString("html_content"))
        .set("edit_mode", structure.getString("edit_mode") || "visual");

      if (pageRowColId) {
        sliderData.set("page_row_col_id", pageRowColId);
      }

      // if (structure.getString("type")) {
      //   const dbSliderType = _db.queryFirst(
      //     `
      //       SELECT
      //         *
      //       FROM page_slider_type
      //       WHERE code = ?
      //     `,
      //     structure.getString("type")
      //   );

      //   if (dbSliderType) {
      //     sliderData.set("type_id", dbSliderType.getInt("id"));
      //   }
      // }

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
          .set(
            "title_invert_background",
            sliderItem.getBoolean("title_invert_background"),
          )
          .set(
            "content_invert_background",
            sliderItem.getBoolean("content_invert_background"),
          )
          .set("image_alt", sliderItem.getString("image_alt"))
          .set("html_content", sliderItem.getString("html_content"))
          .set("edit_mode", sliderItem.getString("edit_mode") || "visual");

        if (sliderItem.getString("image")?.includes("base64")) {
          sliderItemData.set("image", sliderItemImage);
        } else if (sliderItem.getString("image")) {
          const imageFile = _storage
            .database(
              "page_slider_item",
              "image",
              sliderItem.getString("image"),
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

        const sliderItemActions = sliderItem.getList(
          "action_uids",
          _val.list(),
        );

        let actionSorter = 10;

        for (const action of sliderItemActions) {
          const dbAction = _db.get("action", action);
          if (dbAction) {
            _db.insert(
              "page_slider_item_action",
              _val
                .map()
                .set("page_slider_item_id", sliderItemId)
                .set("action_id", dbAction.getInt("id"))
                .set("sorter", actionSorter),
            );
            actionSorter += 10;
          }
        }
      }
    } else if (sectionType === "functionality") {
      const functionalityActions = structure.getList(
        "action_uids",
        _val.list(),
      );
      const functionalityData = _val
        .map()
        .set("page_version_id", newPageVersion)
        .set("type", structure.getString("type"))
        .set("title", structure.getString("title"))
        .set("content", structure.getString("content"))
        .set(
          "title_invert_background",
          structure.getBoolean("title_invert_background"),
        )
        .set(
          "content_invert_background",
          structure.getBoolean("content_invert_background"),
        )
        .set("sorter", structure.getInt("sorter", 0))
        .set("html_content", structure.getString("html_content"))
        .set("edit_mode", structure.getString("edit_mode") || "visual");

      if (image) {
        functionalityData.set("image", image);
      }

      if (pageRowColId) {
        functionalityData.set("page_row_col_id", pageRowColId);
      }

      const functionlityId = _db.insert(
        "page_functionality",
        functionalityData,
      );

      if (image) {
        structuresToPublishImages.push(functionlityId);
      }

      let actionSorter = 10;
      for (const action of functionalityActions) {
        const dbAction = _db.get("action", action);

        if (dbAction) {
          _db.insert(
            "page_functionality_action",
            _val
              .map()
              .set("page_functionality_id", functionlityId)
              .set("action_id", dbAction.getInt("id"))
              .set("sorter", actionSorter),
          );
          actionSorter += 10;
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
      structuresIdsToPublishImages,
    );

    for (const dbStructure of dbStructures) {
      cluar.image.publish(`${key}`, dbStructure.getString("image"));
    }
  }

  const dbNewPageVersion = _db.get("page_version", newPageVersion);

  _out.json(
    _val
      .map()
      .set("result", true)
      .set(
        "data",
        _val.map().set("page_version_uid", dbNewPageVersion.get("uid")),
      ),
  );
} else {
  cluar.response.error({
    status: 409,
    error: "page has no previous version",
    error_code: "page-has-no-previous-version"
  });
}
