
// -----------------------------------------------------------
// 
// CONFIGURATION_PARAMETER
// 
// -----------------------------------------------------------

if (_val.global().getBoolean('cluar:setup')) {
    _db.insertIfNotExists(
        "configuration_parameter",
        _val.init()
            .set("uid", "2c3a4663-8a09-409f-bddf-b1506b7b9fb7")
            .set("code", "footer-address")
            .set("description", "Rodapé - Endere\u00E7o")
    );

    _db.insertIfNotExists(
        "configuration_parameter",
        _val.init()
            .set("uid", "199c3736-4996-4b7b-a565-3a2f45ae8971")
            .set("code", "footer-email")
            .set("description", "Rodapé - E-mail")
    );

    _db.insertIfNotExists(
        "configuration_parameter",
        _val.init()
            .set("uid", "4188eaeb-da5e-4433-8944-2d80752c326d")
            .set("code", "footer-phone")
            .set("description", "Rodapé - Telefone")
    );

    _db.insertIfNotExists(
        "configuration_parameter",
        _val.init()
            .set("uid", "7ac5d2fe-7c98-46b2-826c-f8f4d41f9857")
            .set("code", "map-latitude")
            .set("description", "Mapa - Latitude")
    );

    _db.insertIfNotExists(
        "configuration_parameter",
        _val.init()
            .set("uid", "5502693e-8113-429b-852e-9a7364fc48d0")
            .set("code", "map-longitude")
            .set("description", "Mapa - Longitude")
    );
}