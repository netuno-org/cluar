import cluar from "#core/cluar/main.js"

const sourcePageVersionUid = _req.getString("page_version_uid");
const languageCode = _req.getString("language_code");
const title = _req.getString("title");
const link = _req.getString("link");
const published = _req.getBoolean("published");

if (!sourcePageVersionUid) {
    _header.status(400);
    _out.json({ result: false, error: 'source_page_version_uid is required' });
    _exec.stop();
}

if (!languageCode) {
    _header.status(400);
    _out.json({ result: false, error: 'language_code is required' });
    _exec.stop();
}

if (!title) {
    _header.status(400);
    _out.json({ result: false, error: 'title is required' });
    _exec.stop();
}

if (!link) {
    _header.status(400);
    _out.json({ result: false, error: 'link is required' });
    _exec.stop();
}

if (published !== true && published !== false) {
    _header.status(400);
    _out.json({ result: false, error: 'published is required' });
    _exec.stop();
}

const dbPageVersion = _db.get("page_version", sourcePageVersionUid);
if (!dbPageVersion) {
    _header.status(400);
    _out.json({ result: false, error: 'page version not found' });
    _exec.stop();
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
    _header.status(404);
    _out.json({ result: false, error: `language not found with code: ${languageCode}` });
    _exec.stop();
}

const languageId = dbLanguage.getInt("id");

const linkExists = _db.queryFirst(`
    SELECT * FROM page 
    WHERE link = ?
        AND language_id = ?
`, link, languageId);

if (linkExists) {
    _header.status(409);
    _out.json({ result: false, error: `page link already exists: ${link}` });
    _exec.stop();
}

const dbSourcePageId = dbPageVersion.getInt("page_id");
if (!dbSourcePageId) {
    _header.status(404);
    _out.json({ result: false, error: "source page not found." });
    _exec.stop();
}

const dbSourcePage = _db.form("page")
    .where(
        _db.where("id").equals(dbSourcePageId)
    )
    .first();

const dbMaxSorter = _db.queryFirst(`
    SELECT MAX(sorter) as max_sorter FROM page
    WHERE language_id = ?
        AND parent_id = 0
`, languageId);
const sorter = (dbMaxSorter?.getInt("max_sorter") || 0) + 10;

const newPage = _db.form("page")
    .set('title', title)
    .set('description', dbSourcePage.getString('description'))
    .set('keywords', dbSourcePage.getString('keywords'))
    .set('link', link)
    .set('menu', dbSourcePage.getBoolean('menu'))
    .set('menu_title', title)
    .set('navigable', dbSourcePage.getBoolean('navigable'))
    .set("language_id", languageId)
    .set("status_id", publishedStatus.getInt("id"))
    .set("parent_id", "")
    .set("sorter", sorter)
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
        .set("status_id", draftStatus.getInt("id"))
        .set("created_at", _db.timestamp())
);

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
            .set("html_content", content.getString("html_content"))
            .set("edit_mode", content.getString("edit_mode") || "visual")
            .set("type", content.getString("type"))
            .set("page_version_id", newPageVersion)
            .set("image_title", content.getString("image_title"))
            .set("image", content.getString("image"))
            .set("image_alt", content.getString("image_alt"))
            .set("image_max_width", content.getString("image_max_width"))
            .set("title_invert_background", content.getBoolean("title_invert_background"))
            .set("content_invert_background", content.getBoolean("content_invert_background"))
            .set("sorter", content.getString("sorter"))
            .insert();

        // ******** Actions ********

        const dbContentAction = _db.form('page_content_action')
            .where(
                _db.where("page_content_id").equals(content.getInt("id"))
            )
            .all();

        if (dbContentAction) {
            for (const action of dbContentAction) {
                const dbAction = _db.form('action')
                    .where(
                        _db.where("id").equals(action.getInt("action_id"))
                    )
                    .first();

                if (dbAction) {
                    const dbActionSameParameter = _db.form("action")
                        .where(
                            _db.where("parameter_id").equals(dbAction.getInt("parameter_id"))
                                .and(_db.where("language_id").equals(languageId))
                        )
                        .first()

                    if (dbActionSameParameter) {
                        const actionData = _db.form("page_content_action")
                            .set("action_id", dbActionSameParameter.getInt("id"))
                            .set("page_content_id", contentData.getInt("id"))
                            .set("sorter", action.getInt("sorter"))
                            .insert();
                    }
                }
            }
        }
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
            .set("html_content", banner.getString("html_content"))
            .set("edit_mode", banner.getString("edit_mode") || "visual")
            .set("type", banner.getString("type"))
            .set("page_version_id", newPageVersion)
            .set("image", banner.getString("image"))
            .set("image_title", banner.getString("image_title"))
            .set("image_alt", banner.getString("image_alt"))
            .set("title_invert_background", banner.getBoolean("title_invert_background"))
            .set("content_invert_background", banner.getBoolean("content_invert_background"))
            .set("sorter", banner.getInt("sorter"))
            .insert();

        // ******** Actions ********

        const dbBannerAction = _db.form('page_banner_action')
            .where(
                _db.where("page_banner_id").equals(banner.getInt("id"))
            )
            .all();

        if (dbBannerAction) {
            for (const action of dbBannerAction) {
                const dbAction = _db.form('action')
                    .where(
                        _db.where("id").equals(action.getInt("action_id"))
                    )
                    .first();

                if (dbAction) {
                    const dbActionSameParameter = _db.form("action")
                        .where(
                            _db.where("parameter_id").equals(dbAction.getInt("parameter_id"))
                                .and(_db.where("language_id").equals(languageId))
                        )
                        .first()

                    if (dbActionSameParameter) {
                        const actionData = _db.form("page_banner_action")
                            .set("action_id", dbActionSameParameter.getInt("id"))
                            .set("page_banner_id", bannerData.getInt("id"))
                            .set("sorter", action.getInt("sorter"))
                            .insert();
                    }
                }
            }
        }
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
            .set("html_content", functionality.getString("html_content"))
            .set("edit_mode", functionality.getString("edit_mode") || "visual")
            .set("image", functionality.getString("image"))
            .set("title_invert_background", functionality.getBoolean("title_invert_background"))
            .set("content_invert_background", functionality.getBoolean("content_invert_background"))
            .set("sorter", functionality.getInt("sorter"))
            .insert();

        // ******** Actions ********

        const dbFunctionalityAction = _db.form('page_functionality_action')
            .where(
                _db.where("page_functionality_id").equals(functionality.getInt("id"))
            )
            .all();

        if (dbFunctionalityAction) {
            for (const action of dbFunctionalityAction) {
                const dbAction = _db.form('action')
                    .where(
                        _db.where("id").equals(action.getInt("action_id"))
                    )
                    .first();

                if (dbAction) {
                    const dbActionSameParameter = _db.form("action")
                        .where(
                            _db.where("parameter_id").equals(dbAction.getInt("parameter_id"))
                                .and(_db.where("language_id").equals(languageId))
                        )
                        .first()

                    if (dbActionSameParameter) {
                        const actionData = _db.form("page_functionality_action")
                            .set("action_id", dbActionSameParameter.getInt("id"))
                            .set("page_functionality_id", functionalityData.getInt("id"))
                            .set("sorter", action.getInt("sorter"))
                            .insert();
                    }
                }
            }
        }
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
            .set("title_invert_background", listing.getBoolean("title_invert_background"))
            .set("content_invert_background", listing.getBoolean("content_invert_background"))
            .set("content", listing.getString("content"))
            .set("html_content", listing.getString("html_content"))
            .set("edit_mode", listing.getString("edit_mode") || "visual")
            .insert();

        // ******** Actions ********

        const dbListingAction = _db.form('page_listing_action')
            .where(
                _db.where("page_listing_id").equals(listing.getInt("id"))
            )
            .all();

        if (dbListingAction) {
            for (const action of dbListingAction) {
                const dbAction = _db.form('action')
                    .where(
                        _db.where("id").equals(action.getInt("action_id"))
                    )
                    .first();

                if (dbAction) {
                    const dbActionSameParameter = _db.form("action")
                        .where(
                            _db.where("parameter_id").equals(dbAction.getInt("parameter_id"))
                                .and(_db.where("language_id").equals(languageId))
                        )
                        .first()

                    if (dbActionSameParameter) {
                        const actionData = _db.form("page_listing_action")
                            .set("action_id", dbActionSameParameter.getInt("id"))
                            .set("page_listing_id", listingData.getInt("id"))
                            .set("sorter", action.getInt("sorter"))
                            .insert();
                    }
                }
            }
        }

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
                    .set("html_content", listingItem.getString("html_content"))
                    .set("edit_mode", listingItem.getString("edit_mode") || "visual")
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
            .set("title_invert_background", slider.getBoolean("title_invert_background"))
            .set("content_invert_background", slider.getBoolean("content_invert_background"))
            .set("content", slider.getString("content"))
            .set("html_content", slider.getString("html_content"))
            .set("edit_mode", slider.getString("edit_mode") || "visual")
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
                    .set("html_content", sliderItem.getString("html_content"))
                    .set("edit_mode", sliderItem.getString("edit_mode") || "visual")
                    .set("image", sliderItem.getString("image"))
                    .set("sorter", sliderItem.getString("sorter"))
                    .set("image_title", sliderItem.getString("image_title"))
                    .set("title_invert_background", sliderItem.getBoolean("title_invert_background"))
                    .set("content_invert_background", sliderItem.getBoolean("content_invert_background"))
                    .set("image_alt", sliderItem.getString("image_alt"))
                    .insert();

                // ******** Actions ********

                const dbSliderItemAction = _db.form('page_slider_item_action')
                    .where(
                        _db.where("page_slider_item_id").equals(sliderItem.getInt("id"))
                    )
                    .all();

                if (dbSliderItemAction) {
                    for (const action of dbSliderItemAction) {
                        const dbAction = _db.form('action')
                            .where(
                                _db.where("id").equals(action.getInt("action_id"))
                            )
                            .first();

                        if (dbAction) {
                            const dbActionSameParameter = _db.form("action")
                                .where(
                                    _db.where("parameter_id").equals(dbAction.getInt("parameter_id"))
                                        .and(_db.where("language_id").equals(languageId))
                                )
                                .first()

                            if (dbActionSameParameter) {
                                const actionData = _db.form("page_slider_item_action")
                                    .set("action_id", dbActionSameParameter.getInt("id"))
                                    .set("page_slider_item_id", sliderItemData.getInt("id"))
                                    .set("sorter", action.getInt("sorter"))
                                    .insert();
                            }
                        }
                    }
                }
            }
        }
    }
}

if (statusId === publishedStatus.getInt("id")) {
    _db.update(
        "page_version",
        newPageVersion,
        _val.map().set("status_id", publishedStatus.getInt("id"))
    );

    // v1 vira rascunho
    _db.form("page_version")
        .where(_db.where("page_id").equals(newPage.getInt("id")).and(_db.where("version").equals(1)))
        .set("status_id", draftStatus.getInt("id"))
        .update();

    cluar.page.publish(newPage);
}

_out.json(
    _val.map()
        .set('result', true)
        .set('uid', newPage.getString("uid"))
        .set('link', link)
        .set('language_code', languageCode)
);
