import { _group, _val } from "@netuno/server-types";

if (_val.global().getBoolean('cluar:setup')) {
  _group.createIfNotExists(
    _val.map()
      .set("name", "Pessoa")
      .set("code", "people")
      .set("login_allowed", false)
  );
}
