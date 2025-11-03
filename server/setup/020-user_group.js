// -----------------------------------------------------------
// 
// USER_GROUP
// 
// -----------------------------------------------------------
// 
// CODE GENERATED AUTOMATICALLY
// 

if (_val.global().getBoolean('cluar:setup')) {
  _db.insertIfNotExists(
      "user_group",
      _val.init()
          .set("uid", "9644d669-972d-4102-a718-5901676f09dd")
          .set("name", "Administrador")
          .set("code", "administrator")
  );

  _db.insertIfNotExists(
      "user_group",
      _val.init()
          .set("uid", "1199fb35-1c3a-42aa-a0a0-1b3653faf28e")
          .set("name", "Editor")
          .set("code", "editor")
  );

  _db.insertIfNotExists(
      "user_group",
      _val.init()
          .set("uid", "9bfb903a-0686-4ab4-8e20-531f5b098d50")
          .set("name", "Autor")
          .set("code", "author")
  );

  _db.insertIfNotExists(
      "user_group",
      _val.init()
          .set("uid", "bb647252-6935-469e-b2d4-16be1a6d5e6d")
          .set("name", "Colaborador")
          .set("code", "contributor")
  );

  _db.insertIfNotExists(
      "user_group",
      _val.init()
          .set("uid", "00b45ce1-2a17-4bdd-aaf8-101ce08b6173")
          .set("name", "Assinante")
          .set("code", "subscriber")
  );
}