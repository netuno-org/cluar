import cluar from "#core/cluar/main.js";
import { _req, _db, _val, _out } from "@netuno/server-types";

const version = _req.getString("version");

const dbPageVersion = _db.get("page_version", version);

if (dbPageVersion) {
  const structure = _val.list();
  const sectionsByColumn = new Map();

  const addSection = (sectionData) => {
    const pageRowColId = sectionData.getInt("page_row_col_id", 0);

    if (pageRowColId) {
      if (!sectionsByColumn.has(pageRowColId)) {
        sectionsByColumn.set(pageRowColId, []);
      }
      sectionsByColumn.get(pageRowColId).push(sectionData);
    } else {
      structure.add(sectionData);
    }
  };

  /*
   *
   *  CONTENTS
   *
   */
  const dbContents = _db.query(`
    SELECT
      content.id,
      content.uid,
      content.type,
      content.title,
      content.content,
      content.html_content,
      content.edit_mode,
      content.image,
      content.image_alt,
      content.image_title,
      content.image_max_width,
      content.page_row_col_id,
      content.title_invert_background,
      content.content_invert_background,
      content.sorter
    FROM page_content content
    WHERE content.active = TRUE
      AND content.active = TRUE
      AND content.page_version_id = ${dbPageVersion.getInt("id")}
  `);

  for (const dbContent of dbContents) {
    addSection(
      _val
        .map()
        .set("uid", dbContent.getString("uid"))
        .set("section", "content")
        .set("type", dbContent.getString("type"))
        .set("title", dbContent.getString("title"))
        .set("content", dbContent.getString("content"))
        .set("html_content", dbContent.getString("html_content"))
        .set("edit_mode", dbContent.getString("edit_mode"))
        .set("image", dbContent.getString("image"))
        .set("image_alt", dbContent.getString("image_alt"))
        .set("image_title", dbContent.getString("image_title"))
        .set("image_max_width", dbContent.getString("image_max_width"))
        .set("page_row_col_id", dbContent.getInt("page_row_col_id", 0))
        .set("sorter", dbContent.getInt("sorter"))
        .set(
          "actions",
          cluar.action.getByItem("content", dbContent.getInt("id")),
        )
        .set(
          "title_invert_background",
          dbContent.getBoolean("title_invert_background"),
        )
        .set(
          "content_invert_background",
          dbContent.getBoolean("content_invert_background"),
        ),
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
      banner.type,
      banner.title,
      banner.content,
      banner.html_content,
      banner.edit_mode,
      banner.image,
      banner.image_alt,
      banner.image_title,
      banner.page_row_col_id,
      banner.position_x,
      banner.position_y,
      banner.title_invert_background,
      banner.content_invert_background,
      banner.sorter
    FROM page_banner banner
    WHERE banner.active = TRUE
      AND banner.active = TRUE
      AND banner.page_version_id = ${dbPageVersion.getInt("id")}
  `);

  for (const dbBanner of dbBanners) {
    addSection(
      _val
        .map()
        .set("uid", dbBanner.getString("uid"))
        .set("section", "banner")
        .set("type", dbBanner.getString("type"))
        .set("title", dbBanner.getString("title"))
        .set("content", dbBanner.getString("content"))
        .set("html_content", dbBanner.getString("html_content"))
        .set("edit_mode", dbBanner.getString("edit_mode"))
        .set("image", dbBanner.getString("image"))
        .set("image_alt", dbBanner.getString("image_alt"))
        .set("image_title", dbBanner.getString("image_title"))
        .set("page_row_col_id", dbBanner.getInt("page_row_col_id", 0))
        .set(
          "title_invert_background",
          dbBanner.getBoolean("title_invert_background"),
        )
        .set(
          "content_invert_background",
          dbBanner.getBoolean("content_invert_background"),
        )
        .set("sorter", dbBanner.getInt("sorter"))
        .set(
          "position",
          _val
            .map()
            .set("x", dbBanner.getString("position_x"))
            .set("y", dbBanner.getString("position_y")),
        )
        .set(
          "actions",
          cluar.action.getByItem("banner", dbBanner.getInt("id")),
        ),
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
      listing.type,
      listing.title,
      listing.image_alt,
      listing.image_title,
      listing.content,
      listing.html_content,
      listing.edit_mode, 
      listing.image,
      listing.page_row_col_id,
      listing.title_invert_background,
      listing.content_invert_background,
      listing.sorter
    FROM page_listing listing
    WHERE listing.active = TRUE
      AND listing.active = TRUE
      AND listing.page_version_id = ${dbPageVersion.getInt("id")}
  `);

  for (const dbListing of dbListings) {
    const items = _val.list();
    const dbItems = _db.query(`
      SELECT
          uid, title, content, html_content, edit_mode, image, image_alt, image_title, sorter, link, title_invert_background, content_invert_background
      FROM page_listing_item
      WHERE page_listing_id = ${dbListing.getInt("id")} AND active = TRUE
      `);

    for (const dbItem of dbItems) {
      items.add(
        _val
          .map()
          .set("uid", dbItem.getString("uid"))
          .set("section", "listing_item")
          .set("title", dbItem.getString("title"))
          .set("content", dbItem.getString("content"))
          .set("html_content", dbItem.getString("html_content"))
          .set("edit_mode", dbItem.getString("edit_mode"))
          .set("image", dbItem.getString("image"))
          .set("image_alt", dbItem.getString("image_alt"))
          .set("image_title", dbItem.getString("image_title"))
          .set(
            "title_invert_background",
            dbItem.getBoolean("title_invert_background"),
          )
          .set(
            "content_invert_background",
            dbItem.getBoolean("content_invert_background"),
          )
          .set("sorter", dbItem.getInt("sorter"))
          .set("link", dbItem.getString("link")),
      );

      // if (settings.images === true) {
      //   cluar.publishImage("listing_item", dbItem.getString("image"));
      // }
    }

    addSection(
      _val
        .map()
        .set("uid", dbListing.getString("uid"))
        .set("section", "listing")
        .set("type", dbListing.getString("type"))
        .set("title", dbListing.getString("title"))
        .set("content", dbListing.getString("content"))
        .set("html_content", dbListing.getString("html_content"))
        .set("edit_mode", dbListing.getString("edit_mode"))
        .set("image", dbListing.getString("image"))
        .set("page_row_col_id", dbListing.getInt("page_row_col_id", 0))
        .set("image_alt", dbListing.getString("image_alt"))
        .set("image_title", dbListing.getString("image_title"))
        .set("items", items)
        .set("sorter", dbListing.getInt("sorter"))
        .set(
          "title_invert_background",
          dbListing.getBoolean("title_invert_background"),
        )
        .set(
          "content_invert_background",
          dbListing.getBoolean("content_invert_background"),
        )
        .set(
          "actions",
          cluar.action.getByItem("listing", dbListing.getInt("id")),
        ),
    );

    // if (settings.images === true) {
    //   cluar.publishImage("listing", dbListing.getString("image"));
    // }
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
                slider.html_content,
                slider.edit_mode,
                slider.image,
                slider.page_row_col_id,
                slider.title_invert_background,
                slider.content_invert_background,
                slider.sorter
            FROM page_slider slider
            WHERE slider.active = TRUE
                AND slider.active = TRUE
                AND slider.page_version_id = ${dbPageVersion.getInt("id")}
            `);

  for (const dbSlider of dbSliders) {
    const items = _val.list();
    const dbItems = _db.query(`
                SELECT
                    uid, title, content, html_content, edit_mode, image, image_alt, image_title, sorter, id, title_invert_background, content_invert_background
                FROM page_slider_item
                WHERE page_slider_id = ${dbSlider.getInt(
                  "id",
                )} AND active = TRUE
                `);

    for (const dbItem of dbItems) {
      const itemActions = cluar.action.getByItem(
        "slider_item",
        dbItem.getInt("id"),
      );
      const actionsList = _val.list();

      for (const itemAction of itemActions) {
        actionsList.add(itemAction.getString("uid"));
      }

      items.add(
        _val
          .map()
          .set("uid", dbItem.getString("uid"))
          .set("section", "slider_item")
          .set("title", dbItem.getString("title"))
          .set("content", dbItem.getString("content"))
          .set("html_content", dbItem.getString("html_content"))
          .set("edit_mode", dbItem.getString("edit_mode"))
          .set("image", dbItem.getString("image"))
          .set("image_alt", dbItem.getString("image_alt"))
          .set("image_title", dbItem.getString("image_title"))
          .set(
            "title_invert_background",
            dbItem.getBoolean("title_invert_background"),
          )
          .set(
            "content_invert_background",
            dbItem.getBoolean("content_invert_background"),
          )
          .set("sorter", dbItem.getInt("sorter"))
          .set("action_uids", actionsList),
      );
    }
    addSection(
      _val
        .map()
        .set("uid", dbSlider.getString("uid"))
        .set("section", "slider")
        .set("type", dbSlider.getString("type"))
        .set("title", dbSlider.getString("title"))
        .set("content", dbSlider.getString("content"))
        .set("html_content", dbSlider.getString("html_content"))
        .set("edit_mode", dbSlider.getString("edit_mode"))
        .set("image", dbSlider.getString("image"))
        .set("page_row_col_id", dbSlider.getInt("page_row_col_id", 0))
        .set("image_alt", dbSlider.getString("image_alt"))
        .set("image_title", dbSlider.getString("image_title"))
        .set("items", items)
        .set(
          "title_invert_background",
          dbSlider.getBoolean("title_invert_background"),
        )
        .set(
          "content_invert_background",
          dbSlider.getBoolean("content_invert_background"),
        )
        .set("sorter", dbSlider.getInt("sorter")),
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
      functionality.html_content,
      functionality.edit_mode,
      functionality.image,
      functionality.page_row_col_id,
      functionality.title_invert_background,
      functionality.content_invert_background,
      functionality.sorter
    FROM page_functionality functionality
    WHERE functionality.active = TRUE
      AND functionality.active = TRUE
      AND functionality.page_version_id = ${dbPageVersion.getInt("id")}
  `);

  for (const dbFunctionality of dbFunctionalities) {
    addSection(
      _val
        .map()
        .set("uid", dbFunctionality.getString("uid"))
        .set("section", "functionality")
        .set("type", dbFunctionality.getString("type"))
        .set("title", dbFunctionality.getString("title"))
        .set("content", dbFunctionality.getString("content"))
        .set("html_content", dbFunctionality.getString("html_content"))
        .set("edit_mode", dbFunctionality.getString("edit_mode"))
        .set("image", dbFunctionality.getString("image"))
        .set("page_row_col_id", dbFunctionality.getInt("page_row_col_id", 0))
        .set("sorter", dbFunctionality.getInt("sorter"))
        .set(
          "title_invert_background",
          dbFunctionality.getBoolean("title_invert_background"),
        )
        .set(
          "content_invert_background",
          dbFunctionality.getBoolean("content_invert_background"),
        )
        .set(
          "actions",
          cluar.action.getByItem("functionality", dbFunctionality.getInt("id")),
        ),
    );

    // if (settings.images === true) {
    //   cluar.publishImage("functionality", dbFunctionality.getString("image"));
    // }
  }

  /*
   *
   *  ROW
   *
   */

  const pageVersionId = dbPageVersion.getInt("id");
  const dbRows = _db.query(`
    WITH page_row_columns AS (
      SELECT page_row_col_id AS id FROM page_banner
      WHERE page_version_id = ${pageVersionId} AND page_row_col_id IS NOT NULL
      UNION
      SELECT page_row_col_id FROM page_content
      WHERE page_version_id = ${pageVersionId} AND page_row_col_id IS NOT NULL
      UNION
      SELECT page_row_col_id FROM page_listing
      WHERE page_version_id = ${pageVersionId} AND page_row_col_id IS NOT NULL
      UNION
      SELECT page_row_col_id FROM page_slider
      WHERE page_version_id = ${pageVersionId} AND page_row_col_id IS NOT NULL
      UNION
      SELECT page_row_col_id FROM page_functionality
      WHERE page_version_id = ${pageVersionId} AND page_row_col_id IS NOT NULL
    )
    SELECT
      page_row.id,
      page_row.uid,
      page_row.title,
      page_row.content,
      page_row.page_row_col_id,
      page_row.sorter
    FROM page_row
    WHERE page_row.active = TRUE
      AND page_row.page_version_id = ${pageVersionId}
      AND (
        page_row.page_row_col_id IS NULL
        OR
        page_row.page_row_col_id IN (SELECT id FROM page_row_columns)
        OR EXISTS (
          SELECT 1
          FROM page_row_col
          WHERE page_row_col.page_row_id = page_row.id
            AND page_row_col.id IN (SELECT id FROM page_row_columns)
        )
      )
    ORDER BY page_row.id
  `);

  const rowsById = new Map();

  for (const dbRow of dbRows) {
    const row = _val
      .map()
      .set("uid", dbRow.getString("uid"))
      .set("section", "row")
      .set("type", "Default")
      .set("title", dbRow.getString("title"))
      .set("content", dbRow.getString("content"))
      .set("items", _val.list())
      .set("sorter", dbRow.getInt("sorter"))
      .set("page_row_col_id", dbRow.getInt("page_row_col_id", 0));

    rowsById.set(dbRow.getInt("id"), row);
    addSection(row);
  }

  for (const dbRow of dbRows) {
    const items = _val.list();
    const dbColumns = _db.query(`
      SELECT
        id,
        uid,
        title,
        span,
        xs,
        sm,
        md,
        lg,
        xl,
        xxl,
        xxxl
      FROM page_row_col
      WHERE page_row_id = ${dbRow.getInt("id")}
        AND active = TRUE
      ORDER BY id
    `);

    for (const dbColumn of dbColumns) {
      const column = _val
        .map()
        .set("uid", dbColumn.getString("uid"))
        .set("section", "col")
        .set("title", dbColumn.getString("title"))
        .set("span", dbColumn.getInt("span", -1))
        .set("xs", dbColumn.getInt("xs", -1))
        .set("sm", dbColumn.getInt("sm", -1))
        .set("md", dbColumn.getInt("md", -1))
        .set("lg", dbColumn.getInt("lg", -1))
        .set("xl", dbColumn.getInt("xl", -1))
        .set("xxl", dbColumn.getInt("xxl", -1))
        .set("xxxl", dbColumn.getInt("xxxl", -1));

      const columnSections = sectionsByColumn.get(dbColumn.getInt("id"));
      if (columnSections?.length) {
        column.set("section", columnSections[0]);
      }

      items.add(column);
    }

    rowsById.get(dbRow.getInt("id")).set("items", items);
  }

  structure.sort((a, b) => a.getInt("sorter") - b.getInt("sorter"));

  _out.json(_val.map().set("result", true).set("structure", structure));
}
