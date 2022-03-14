
// -----------------------------------------------------------
// 
// CONTENT_TYPE
// 
// -----------------------------------------------------------

_db.insertIfNotExists(
    "content_type",
    _val.init()
        .set("uid", "5d68fe7f-bfc9-424b-98bc-50c0bfe96f2f")
        .set("code", "text")
        .set("description", "Texto")
);

_db.insertIfNotExists(
    "content_type",
    _val.init()
        .set("uid", "6638fba0-ce12-4f99-be1f-a407eea2eeab")
        .set("code", "image-left")
        .set("description", "Imagem \u00E0 Esquerda")
);

_db.insertIfNotExists(
    "content_type",
    _val.init()
        .set("uid", "03a63665-e41d-4549-bd4c-85063c978968")
        .set("code", "image-right")
        .set("description", "Imagem \u00E0 Direita")
);

_db.insertIfNotExists(
    "content_type",
    _val.init()
        .set("uid", "b01f00ae-7179-4a21-bb7b-b9ac6efb94db")
        .set("code", "image-top")
        .set("description", "Imagem no Topo")
);

_db.insertIfNotExists(
    "content_type",
    _val.init()
        .set("uid", "b79a8510-482c-43a6-9f00-3f7eb093b347")
        .set("code", "image-bottom")
        .set("description", "Imagem Embaixo")
);
