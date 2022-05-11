
// -----------------------------------------------------------
// 
// PAGE
// 
// -----------------------------------------------------------

if (_db.query(`SELECT * FROM page`).size() == 0) {
    _val.global().set('cluar:setup', true);
    _db.insertIfNotExists(
        "page",
        _val.init()
            .set("uid", "0194d0aa-c5ec-4f9d-abab-de6298c5f9e9")
            .set("language_id", "b6804103-2f6c-4184-a431-0c8b94ea7322")
            .set("parent_id", null)
            .set("link", "/")
            .set("title", "Principal")
            .set("status_id", "e24a0cdf-c860-48f2-b597-689f165fd110")
            .set("description", "")
            .set("social_description", "")
            .set("keywords", "")
            .set("social_image", "")
            .set("navigable", true)
            .set("menu", true)
            .set("menu_title", "")
            .set("sorter", 10)
    );
    _db.insertIfNotExists(
        "page",
        _val.init()
            .set("uid", "5002a742-e092-4c0b-8536-546bd1319c7f")
            .set("language_id", "dd9ca34e-3f70-461d-a42d-234651233658")
            .set("parent_id", null)
            .set("link", "/")
            .set("title", "Home")
            .set("status_id", "e24a0cdf-c860-48f2-b597-689f165fd110")
            .set("description", "")
            .set("social_description", "")
            .set("keywords", "")
            .set("social_image", "")
            .set("navigable", true)
            .set("menu", true)
            .set("menu_title", "")
            .set("sorter", 10)
    );
}
