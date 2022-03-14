
// -----------------------------------------------------------
// 
// CONFIGURATION_PARAMETER
// 
// -----------------------------------------------------------

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
