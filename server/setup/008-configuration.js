
// -----------------------------------------------------------
// 
// CONFIGURATION
// 
// -----------------------------------------------------------

if (_val.global().getBoolean('cluar:setup')) {
  _db.insertIfNotExists(
    "configuration",
    _val.init()
      .set("uid", "f7ca0cbc-d439-41c0-879b-862ec11a232a")
      .set("language_id", null)
      .set("parameter_id", "7ac5d2fe-7c98-46b2-826c-f8f4d41f9857")
      .set("value", "38.7038342")
  );
  
  _db.insertIfNotExists(
    "configuration",
    _val.init()
      .set("uid", "96f3dacf-8059-4a32-8959-3827cc2d0422")
      .set("language_id", null)
      .set("parameter_id", "5502693e-8113-429b-852e-9a7364fc48d0")
      .set("value", "-8.9698548")
  );
  
  _db.insertIfNotExists(
    "configuration",
    _val.init()
      .set("uid", "1eae692a-d89c-475f-878e-56ba9a286435")
      .set("language_id", "b6804103-2f6c-4184-a431-0c8b94ea7322")
      .set("parameter_id", "199c3736-4996-4b7b-a565-3a2f45ae8971")
      .set("value", "meu@e-mail.org")
  );
  
  _db.insertIfNotExists(
    "configuration",
    _val.init()
      .set("uid", "5e991293-9430-48c9-8d0f-3673fa97b2ee")
      .set("language_id", "dd9ca34e-3f70-461d-a42d-234651233658")
      .set("parameter_id", "199c3736-4996-4b7b-a565-3a2f45ae8971")
      .set("value", "my@e-mail.org")
  );
  
  _db.insertIfNotExists(
    "configuration",
    _val.init()
      .set("uid", "6dad2c47-66ab-436a-a171-92fb95d3cbdc")
      .set("language_id", null)
      .set("parameter_id", "2c3a4663-8a09-409f-bddf-b1506b7b9fb7")
      .set("value", "Netuno.org, Cluar CMS\r\nOpen Source")
  );
  
  _db.insertIfNotExists(
    "configuration",
    _val.init()
      .set("uid", "c330772c-98b4-4ef7-8578-3fef4f8355c4")
      .set("language_id", null)
      .set("parameter_id", "4188eaeb-da5e-4433-8944-2d80752c326d")
      .set("value", "99999 9999")
  );
}