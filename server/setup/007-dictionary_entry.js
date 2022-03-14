
// -----------------------------------------------------------
// 
// DICTIONARY_ENTRY
// 
// -----------------------------------------------------------

_db.insertIfNotExists(
    "dictionary_entry",
    _val.init()
        .set("uid", "2c3a4663-8a09-409f-bddf-b1506b7b9fb7")
        .set("code", "footer-address")
        .set("description", "Rodapé - Endere\u00E7o")
);

_db.insertIfNotExists(
    "dictionary_entry",
    _val.init()
        .set("uid", "199c3736-4996-4b7b-a565-3a2f45ae8971")
        .set("code", "footer-email")
        .set("description", "Rodapé - E-mail")
);

_db.insertIfNotExists(
    "dictionary_entry",
    _val.init()
        .set("uid", "199c3736-4996-4b7b-a565-3a2f45ae8971")
        .set("code", "footer-phone")
        .set("description", "Rodapé - Telefone")
);
