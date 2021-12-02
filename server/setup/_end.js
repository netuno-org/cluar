// _core : Cluar

if (_db.query(`SELECT * FROM page`).size() == 0) {
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
            .set("menu", true)
            .set("menu_title", "")
            .set("sorter", 0)
    );
    Cluar.build();
}
