import { _db, _val } from "@netuno/server-types";

if (_db.query(`SELECT * FROM page`).size() == 0) {
  _val.global().set('cluar:setup', true);
}
