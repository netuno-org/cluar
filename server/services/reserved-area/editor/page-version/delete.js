import { _db, _val, _req, _out } from "@netuno/server-types";

const pageVersion = _req.getString("uid");

const dbPageVersion = _db.get("page_version", pageVersion);

if (pageVersion) {
  const pageVersionId = dbPageVersion.getInt("id");

  _db.execute(
    `
    DELETE FROM page_content
    WHERE page_version_id = ?
  `,
    pageVersionId
  );

  _db.execute(
    `
    DELETE FROM page_banner
    WHERE page_version_id = ?
  `,
    pageVersionId
  );

  _db.execute(
    `
    DELETE FROM page_functionality
    WHERE page_version_id = ?
  `,
    pageVersionId
  );

  _db.execute(
    `
    DELETE FROM page_listing_item
    WHERE page_listing_id IN (
        SELECT id FROM page_listing WHERE page_version_id = ?
    )
    `,
    pageVersionId
  );

  _db.execute(
    `
    DELETE FROM page_listing
    WHERE page_version_id = ?
  `,
    pageVersionId
  );

  _db.execute(
    `
    DELETE FROM page_slider_item
    WHERE page_slider_id IN (
        SELECT id FROM page_slider WHERE page_version_id = ?
    )
  `,
    pageVersionId
  );

  _db.execute(
    `
    DELETE FROM page_slider
    WHERE page_version_id = ?
  `,
    pageVersionId
  );

  _db.execute(
    `
    DELETE FROM page_version
    WHERE id = ?
  `,
    pageVersionId
  );

  _out.json(_val.map().set("result", true));
} else {
  _out.json(_val.map().set("result", false).set("error", "not-found"));
}
