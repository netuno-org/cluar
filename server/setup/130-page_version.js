

// -----------------------------------------------------------
// 
// PAGE_VERSION
// 
// -----------------------------------------------------------
// 
// CODE GENERATED AUTOMATICALLY
// 

if (_val.global().getBoolean('cluar:setup')) {
    _db.insertIfNotExists(
        "page_version",
        _val.init()
            .set("uid", "9529dfcc-9a15-45ab-9f30-fee4bc75d154")
            .set("page_id", "0194d0aa-c5ec-4f9d-abab-de6298c5f9e9")
            .set("version", 1)
            .set("status_id", "e24a0cdf-c860-48f2-b597-689f165fd110")
            .set("created_at", _db.timestamp())
    );

    _db.insertIfNotExists(
        "page_version",
        _val.init()
            .set("uid", "eb14d6ee-db83-434c-879e-20e0825cff21")
            .set("page_id", "5002a742-e092-4c0b-8536-546bd1319c7f")
            .set("version", 1)
            .set("status_id", "e24a0cdf-c860-48f2-b597-689f165fd110")
            .set("created_at", _db.timestamp())
    );
}