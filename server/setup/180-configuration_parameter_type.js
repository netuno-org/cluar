
// -----------------------------------------------------------
// 
// TIPO
// 
// -----------------------------------------------------------

if (_val.global().getBoolean('cluar:setup')) {
  _db.insertIfNotExists(
      "configuration_parameter_type",
      _val.init()
          .set("code", "boolean")
          .set("name", "Booleano")
  );

  _db.insertIfNotExists(
    "configuration_parameter_type",
    _val.init()
        .set("code", "number")
        .set("name", "Número")
  );

  _db.insertIfNotExists(
    "configuration_parameter_type",
    _val.init()
        .set("code", "image")
        .set("name", "Imagem")
  );

  _db.insertIfNotExists(
    "configuration_parameter_type",
    _val.init()
        .set("code", "color")
        .set("name", "Cor")
  );

  _db.insertIfNotExists(
    "configuration_parameter_type",
    _val.init()
        .set("code", "text")
        .set("name", "Texto")
  );

  _db.insertIfNotExists(
    "configuration_parameter_type",
    _val.init()
        .set("code", "html")
        .set("name", "HTML")
  );
}