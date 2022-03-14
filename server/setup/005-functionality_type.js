
// -----------------------------------------------------------
// 
// FUNCTIONALITY_TYPE
// 
// -----------------------------------------------------------

_db.insertIfNotExists(
    "functionality_type",
    _val.init()
        .set("uid", "2d35fd56-0256-4fc5-a685-8eccf02f17d3")
        .set("code", "contact-form")
        .set("description", "Formul\u00E1rio de Contacto")
);

_db.insertIfNotExists(
    "functionality_type",
    _val.init()
        .set("uid", "a1d26bda-57cd-4ba1-9aa3-868714260b01")
        .set("code", "contact-map")
        .set("description", "Mapa")
);
