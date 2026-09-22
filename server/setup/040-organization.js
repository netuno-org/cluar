// -----------------------------------------------------------
//
// ORGANIZATION
//
// -----------------------------------------------------------
//
// CODE GENERATED AUTOMATICALLY
//

import { _db, _val } from "@netuno/server-types";

if (_val.global().getBoolean('cluar:setup')) {
  _db.insertIfNotExists(
    "organization",
    _val.init()
      .set("uid", "e27a232e-ba5b-4397-b17c-ff458c42a442")
      .set("name", "Base")
      .set("code", "base")
      .set("parent_id", null)
  );
}
