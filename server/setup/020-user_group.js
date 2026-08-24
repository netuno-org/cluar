// -----------------------------------------------------------
// 
// USER_GROUP
// 
// -----------------------------------------------------------
// 
// CODE GENERATED AUTOMATICALLY
// 

import { _val, _db } from "@netuno/server-types";

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
}
