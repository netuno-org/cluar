
// -----------------------------------------------------------
// 
// BANNER
// 
// -----------------------------------------------------------

if (_val.global().getBoolean('cluar:setup')) {
    _db.insertIfNotExists(
        "banner",
        _val.init()
        .set("uid", "5126f3bb-51d1-489e-89dc-08087ed38e5e")
        .set("page_id", "0194d0aa-c5ec-4f9d-abab-de6298c5f9e9")
        .set("type_id", "d7ca6e7d-08a7-4ec0-8d16-9e3f09cd657c")
        .set("image", _storage.filesystem('server', 'default-banner-background.jpg').file())
        .set("image_title", "")
        .set("image_alt", "")
        .set("title", "Prestes a Voar")
        .set("content", "<p>Aqui é onde voc\u00EA lan\u00E7a websites em uma outra dimens\u00E3o.</p>")
        .set("sorter", 10)
        .set("position_x", "")
        .set("position_y", "")
    );
    _db.insertIfNotExists(
        "banner",
        _val.init()
        .set("uid", "9302bc90-d687-494d-bfc0-b4aeff4df09e")
        .set("page_id", "5002a742-e092-4c0b-8536-546bd1319c7f")
        .set("type_id", "d7ca6e7d-08a7-4ec0-8d16-9e3f09cd657c")
        .set("image", _storage.filesystem('server', 'default-banner-background.jpg').file())
        .set("image_title", "")
        .set("image_alt", "")
        .set("title", "Ready to Fly")
        .set("content", "<p>Here is where you launch websites into another dimension.</p>")
        .set("sorter", 10)
        .set("position_x", "")
        .set("position_y", "")
    );
}