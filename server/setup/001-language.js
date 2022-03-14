
// -----------------------------------------------------------
// 
// LANGUAGE
// 
// -----------------------------------------------------------

_db.insertIfNotExists(
    "language",
    _val.init()
        .set("uid", "b6804103-2f6c-4184-a431-0c8b94ea7322")
        .set("code", "PT")
        .set("locale", "pt")
        .set("description", "Portugu\u00EAs")
        .set("default", true)
);

_db.insertIfNotExists(
    "language",
    _val.init()
        .set("uid", "dd9ca34e-3f70-461d-a42d-234651233658")
        .set("code", "EN")
        .set("locale", "en")
        .set("description", "English")
        .set("default", false)
);
