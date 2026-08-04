// _core: cluar/main
import { _db, _val, _req, _out, _header, _exec } from "@netuno/server-types";
import response from "#core/utils/response.js";

const sourcePageVersionUid = _req.getString("page_version_uid");
const languageCode = _req.getString("language_code");
const title = _req.getString("title");
const link = _req.getString("link");
const published = _req.getBoolean("published");

/* ---------- VALIDAÇÕES DOS DADOS RECEBIDOS ---------- */
if (!sourcePageVersionUid) {
    response.error({ status: 400, error: 'source_page_version_uid is required' });
}

if (!languageCode) {
    response.error({ status: 400, error: 'language_code is required' })
}

if (!title) {
    response.error({ status: 400, error: 'title is required' })
}

if (!link) {
    response.error({ status: 400, error: 'link is required' })
}

if (published !== true && published !== false) {
    response.error({ status: 400, error: 'published is required' })
}

const dbPageVersion = _db.get("page_version", sourcePageVersionUid);
if (!dbPageVersion) {
    response.error({ status: 400, error: 'page version not found' })
}

const draftStatus = _db.queryFirst(`SELECT * FROM page_status WHERE code = 'draft'`);
const publishedStatus = _db.queryFirst(`SELECT * FROM page_status WHERE code = 'published'`);

let statusId;
if (published === true) {
    statusId = publishedStatus.getInt("id");
} else {
    statusId = draftStatus.getInt("id")
}

const dbLanguage = _db.queryFirst(`
    SELECT id, code, description FROM language WHERE code = ?
`, languageCode);

if (!dbLanguage) {
    response.error({ status: 404, error: `language not found with code: ${languageCode}` })
}

const languageId = dbLanguage.getInt("id");

const linkExists = _db.queryFirst(`
    SELECT * FROM page 
    WHERE link = ?
        AND language_id = ?
`, link, languageId);

if (linkExists) {
    response.error({ status: 409, error: `page link already exists: ${link}` })
}

const dbSourcePageId = dbPageVersion.getInt("page_id");
if (!dbSourcePageId) {
    response.error({ status: 404, error: "source page not found." })
}

const dbSourcePage = _db.form("page")
    .where(
        _db.where("id").equals(dbSourcePageId)
    )
    .first();

const newPage = _db.form("page")
    .set('title', title)
    .set('description', dbSourcePage.getString('description'))
    .set('keywords', dbSourcePage.getString('keywords'))
    .set('link', link)
    .set('menu', dbSourcePage.getBoolean('menu'))
    .set('menu_title', dbSourcePage.getString('menu_title'))
    .set('navigable', dbSourcePage.getBoolean('navigable'))
    .set("language_id", languageId)
    .set("status_id", publishedStatus.getInt("id"))
    .set("parent_id", "")
    .set("social_image", "")
    .set("social_description", dbSourcePage.getString('social_description'))
    .set("template", dbSourcePage.getString('template'))
    .insert();

const newPageVersion = _db.insert(
    "page_version",
    _val
        .map()
        .set("page_id", newPage.getInt("id"))
        .set("language_id", languageId)
        .set("version", 2)
        .set("status_id", statusId)
        .set("created_at", _db.timestamp())
);

if (statusId === publishedStatus.getInt("id")) {
    // v1 vira rascunho
    _db.form("page_version")
        .where(_db.where("page_id").equals(newPage.getInt("id")).and(_db.where("version").equals(1)))
        .set("status_id", draftStatus.getInt("id"))
        .update();
}

const dbContent = _db.form("page_content")
    .where(
        _db.where("page_version_id").equals(dbPageVersion.getInt("id"))
    )
    .all();

if (dbContent) {
    for (const content of dbContent) {
        const contentData = _db.form("page_content")
            .set("title", content.getString("title"))
            .set("content", content.getString("content"))
            .set("type", content.getString("type"))
            .set("page_version_id", newPageVersion)
            .set("image_title", content.getString("image_title"))
            .set("image", content.getString("image"))
            .set("image_alt", content.getString("image_alt"))
            .set("image_max_width", content.getString("image_max_width"))
            .set("language_id", languageId)
            .set("title_invert_background", content.getBoolean("title_invert_background"))
            .set("content_invert_background", content.getBoolean("content_invert_background"))
            .set("sorter", content.getString("sorter"))
            .insert();
    }

}

const dbBanner = _db.form("page_banner")
    .where(
        _db.where("page_version_id").equals(dbPageVersion.getInt("id"))
    )
    .all();

if (dbBanner) {
    for (const banner of dbBanner) {
        const bannerData = _db.form("page_banner")
            .set("title", banner.getString("title"))
            .set("content", banner.getString("content"))
            .set("type", banner.getString("type"))
            .set("page_version_id", newPageVersion)
            .set("image", banner.getString("image"))
            .set("image_title", banner.getString("image_title"))
            .set("image_alt", banner.getString("image_alt"))
            .set("language_id", languageId)
            .set("title_invert_background", banner.getBoolean("title_invert_background"))
            .set("content_invert_background", banner.getBoolean("content_invert_background"))
            .set("sorter", banner.getInt("sorter"))
            .insert();
    }
}

const dbFunctionality = _db.form("page_functionality")
    .where(
        _db.where("page_version_id").equals(dbPageVersion.getInt("id"))
    )
    .all();

if (dbFunctionality) {
    for (const functionality of dbFunctionality) {
        const functionalityData = _db.form("page_functionality")
            .set("page_version_id", newPageVersion)
            .set("type", functionality.getString("type"))
            .set("title", functionality.getString("title"))
            .set("content", functionality.getString("content"))
            .set("image", functionality.getString("image"))
            .set("title_invert_background", functionality.getBoolean("title_invert_background"))
            .set("content_invert_background", functionality.getBoolean("content_invert_background"))
            .set("sorter", functionality.getInt("sorter"))
            .insert();
    }
}

const dbListing = _db.form("page_listing")
    .where(
        _db.where("page_version_id").equals(dbPageVersion.getInt("id"))
    )
    .all();

if (dbListing) {
    for (const listing of dbListing) {
        const listingData = _db.form("page_listing")
            .set("page_version_id", newPageVersion)
            .set("title", listing.getString("title"))
            .set("sorter", listing.getInt("sorter"))
            .set("image", listing.getString("image"))
            .set("image_title", listing.getString("image_title"))
            .set("image_alt", listing.getString("image_alt"))
            .set("type", listing.getString("type"))
            .set("language_id", languageId)
            .set("title_invert_background", listing.getBoolean("title_invert_background"))
            .set("content_invert_background", listing.getBoolean("content_invert_background"))
            .set("content", listing.getString("content"))
            .insert();

        const dbListingItems = _db.form("page_listing_item")
            .where(
                _db.where("page_listing_id").equals(listing.getInt("id"))
            )
            .all();

        if (dbListingItems) {
            for (const listingItem of dbListingItems) {
                const listingItemData = _db.form("page_listing_item")
                    .set("page_listing_id", listingData.getInt("id"))
                    .set("title", listingItem.getString("title"))
                    .set("content", listingItem.getString("content"))
                    .set("link", listingItem.getString("link"))
                    .set("sorter", listingItem.getString("sorter"))
                    .set("image", listingItem.getString("image"))
                    .set("image_title", listingItem.getString("image_title"))
                    .set("title_invert_background", listingItem.getBoolean("title_invert_background"))
                    .set("content_invert_background", listingItem.getBoolean("content_invert_background"))
                    .set("image_alt", listingItem.getString("image_alt"))
                    .insert();
            }
        }
    }
}

/* page_slider - revisar */
const dbSlider = _db.form("page_slider")
    .where(
        _db.where("page_version_id").equals(dbPageVersion.getInt("id"))
    )
    .all();

if (dbSlider) {
    for (const slider of dbSlider) {
        const sliderData = _db.form("page_slider")
            .set("page_version_id", newPageVersion)
            .set("title", slider.getString("title"))
            .set("sorter", slider.getInt("sorter"))
            .set("type", slider.getString("type"))
            .set("language_id", languageId)
            .set("title_invert_background", slider.getBoolean("title_invert_background"))
            .set("content_invert_background", slider.getBoolean("content_invert_background"))
            .set("content", slider.getString("content"))
            .set("image", slider.getString("image"))
            .set("image_title", slider.getString("image_title"))
            .set("image_alt", slider.getString("image_alt"))
            .insert();

        const dbSliderItems = _db.form("page_slider_item")
            .where(
                _db.where("page_slider_id").equals(slider.getInt("id"))
            )
            .all();

        if (dbSliderItems) {
            for (const sliderItem of dbSliderItems) {
                const sliderItemData = _db.form("page_slider_item")
                    .set("page_slider_id", sliderData.getInt("id"))
                    .set("title", sliderItem.getString("title"))
                    .set("content", sliderItem.getString("content"))
                    .set("image", sliderItem.getString("image"))
                    .set("sorter", sliderItem.getString("sorter"))
                    .set("image_title", sliderItem.getString("image_title"))
                    .set("title_invert_background", sliderItem.getBoolean("title_invert_background"))
                    .set("content_invert_background", sliderItem.getBoolean("content_invert_background"))
                    .set("image_alt", sliderItem.getString("image_alt"))
                    .insert();
            }
        }
    }
}

_out.json(
    _val.map()
        .set('result', true)
        .set('link', link)
        .set('language_code', languageCode)
);
