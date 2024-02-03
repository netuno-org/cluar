
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
        .set("language_id", "b6804103-2f6c-4184-a431-0c8b94ea7322")
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
        .set("language_id", "dd9ca34e-3f70-461d-a42d-234651233658")
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
