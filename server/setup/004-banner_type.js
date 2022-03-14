
// -----------------------------------------------------------
// 
// BANNER_TYPE
// 
// -----------------------------------------------------------

_db.insertIfNotExists(
    "banner_type",
    _val.init()
        .set("uid", "d7ca6e7d-08a7-4ec0-8d16-9e3f09cd657c")
        .set("code", "default")
        .set("description", "Padr\u00E3o")
);

_db.insertIfNotExists(
    "banner_type",
    _val.init()
        .set("uid", "fa15255a-a309-4ef5-bf72-935fd4e1c1a7")
        .set("code", "secondary")
        .set("description", "P\u00E1gina secund\u00E1ria")
);

_db.insertIfNotExists(
    "banner_type",
    _val.init()
        .set("uid", "beb0dcb5-b445-4a44-b038-522c4c544c01")
        .set("code", "default-sub-banner")
        .set("description", "Padr\u00E3o com Destaque")
);
