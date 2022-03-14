
// -----------------------------------------------------------
// 
// PAGE_STATUS
// 
// -----------------------------------------------------------

_db.insertIfNotExists(
    "page_status",
    _val.init()
        .set("uid", "e24a0cdf-c860-48f2-b597-689f165fd110")
        .set("code", "published")
        .set("description", "Publicada")
);

_db.insertIfNotExists(
    "page_status",
    _val.init()
        .set("uid", "b0389f50-4dc3-4be1-ad1e-070573a3f999")
        .set("code", "draft")
        .set("description", "Rascunho")
);
