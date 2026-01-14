
// -----------------------------------------------------------
// 
// TYPE
// 
// -----------------------------------------------------------

if (_val.global().getBoolean('cluar:setup')) {
  _db.insertIfNotExists(
      "configuration_parameter_type",
      _val.init()
          .set("uid", "2c23ff93-a8b2-4949-82c8-11e3f80f5c07")
          .set("code", "boolean")
          .set("name", "Booleano")
  );

  _db.insertIfNotExists(
    "configuration_parameter_type",
    _val.init()
        .set("uid", "a3378b80-ade5-49ae-9583-b0e48ba7b4ee")
        .set("code", "number")
        .set("name", "Número")
  );

  _db.insertIfNotExists(
    "configuration_parameter_type",
    _val.init()
        .set("uid", "cb36c216-bce5-4f5a-82a3-8b66593937e5")
        .set("code", "image")
        .set("name", "Imagem")
  );

  _db.insertIfNotExists(
    "configuration_parameter_type",
    _val.init()
        .set("uid", "bf5662da-640d-4526-83c6-2a74cd92deff")
        .set("code", "color")
        .set("name", "Cor")
  );

  _db.insertIfNotExists(
    "configuration_parameter_type",
    _val.init()
        .set("uid", "9aa06e94-1b26-4f90-8291-51f9d802110d")
        .set("code", "text")
        .set("name", "Texto")
  );

  _db.insertIfNotExists(
    "configuration_parameter_type",
    _val.init()
        .set("uid", "aa3da0d9-77b2-48ba-8dd5-cd53e84a9fb8")
        .set("code", "html")
        .set("name", "HTML")
  );
}