
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
            .set("configuration_parameter_type_id", "9aa06e94-1b26-4f90-8291-51f9d802110d")
    );

    _db.insertIfNotExists(
        "configuration_parameter",
        _val.init()
            .set("uid", "199c3736-4996-4b7b-a565-3a2f45ae8971")
            .set("code", "footer-email")
            .set("description", "Rodapé - E-mail")
            .set("configuration_parameter_type_id", "9aa06e94-1b26-4f90-8291-51f9d802110d")
    );

    _db.insertIfNotExists(
        "configuration_parameter",
        _val.init()
            .set("uid", "4188eaeb-da5e-4433-8944-2d80752c326d")
            .set("code", "footer-phone")
            .set("description", "Rodapé - Telefone")
            .set("configuration_parameter_type_id", "9aa06e94-1b26-4f90-8291-51f9d802110d")
    );

    _db.insertIfNotExists(
        "configuration_parameter",
        _val.init()
            .set("uid", "7ac5d2fe-7c98-46b2-826c-f8f4d41f9857")
            .set("code", "map-latitude")
            .set("description", "Mapa - Latitude")
            .set("configuration_parameter_type_id", "9aa06e94-1b26-4f90-8291-51f9d802110d")
    );

    _db.insertIfNotExists(
        "configuration_parameter",
        _val.init()
            .set("uid", "5502693e-8113-429b-852e-9a7364fc48d0")
            .set("code", "map-longitude")
            .set("description", "Mapa - Longitude")
            .set("configuration_parameter_type_id", "9aa06e94-1b26-4f90-8291-51f9d802110d")
    );

    _db.insertIfNotExists(
        "configuration_parameter",
        _val.init()
            .set("uid", "5af389c8-ca95-4430-8f24-0e8517ff90a0")
            .set("code", "contact-notification-recipient")
            .set("description", "Destinat\u00E1rio da notifica\u00E7\u00E3o de contato")
            .set("configuration_parameter_type_id", "9aa06e94-1b26-4f90-8291-51f9d802110d")
      );

    _db.insertIfNotExists(
        "configuration_parameter",
        _val.init()
            .set("uid", "eba53efb-bfa5-47cf-bd09-8929c6272b00")
            .set("code", "primary-color")
            .set("description", "Cor Primária")
            .set("configuration_parameter_type_id", "bf5662da-640d-4526-83c6-2a74cd92deff")
    );

    _db.insertIfNotExists(
        "configuration_parameter",
        _val.init()
            .set("uid", "a2e4625f-fd27-44bf-8c88-8cbc49c6f2b0")
            .set("code", "background-color-light")
            .set("description", "Background Light")
            .set("configuration_parameter_type_id", "bf5662da-640d-4526-83c6-2a74cd92deff")
    );

    _db.insertIfNotExists(
        "configuration_parameter",
        _val.init()
            .set("uid", "1d0f0380-8124-49c7-a90f-bc7e03f37b46")
            .set("code", "background-color-dark")
            .set("description", "Background Dark")
            .set("configuration_parameter_type_id", "bf5662da-640d-4526-83c6-2a74cd92deff")
    );

    _db.insertIfNotExists(
        "configuration_parameter",
        _val.init()
            .set("uid", "ea3c0727-9ba6-4746-b2ce-06f18b5b2bb6")
            .set("code", "logo")
            .set("description", "Logo")
            .set("configuration_parameter_type_id", "cb36c216-bce5-4f5a-82a3-8b66593937e5")
    );

    _db.insertIfNotExists(
        "configuration_parameter",
        _val.init()
            .set("uid", "316ca6b6-4d86-4157-8a37-7a609e621289")
            .set("code", "text-font-base")
            .set("description", "Tamanho geral do texto")
            .set("configuration_parameter_type_id", "a3378b80-ade5-49ae-9583-b0e48ba7b4ee")
    );

    _db.insertIfNotExists(
        "configuration_parameter",
        _val.init()
            .set("uid", "704568c7-84ae-49da-b149-c589fc8c8117")
            .set("code", "theme-switch")
            .set("description", "Habilitar switch de tema")
            .set("configuration_parameter_type_id", "2c23ff93-a8b2-4949-82c8-11e3f80f5c07")
    );
}