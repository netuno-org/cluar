// -----------------------------------------------------------
//
// PEOPLE
//
// -----------------------------------------------------------
//
// CODE GENERATED AUTOMATICALLY
//

import { _db, _val } from "@netuno/server-types";

if (_val.global().getBoolean('cluar:setup')) {
  _db.insertIfNotExists(
    "people",
    _val.init()
      .set("uid", "c8d507dc-e6b9-4850-92ef-14f710745573")
      .set("name", "admin")
      .set("people_user_id", 2)
      .set("email", "admin@admin.com")
      .set("avatar", "")
      .set("recovery_key", "")
  );
}
