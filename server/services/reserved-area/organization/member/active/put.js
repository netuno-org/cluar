import { _db, _val, _req, _out } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const {
  uid,
  active
} = JSON.parse(_req.toJSON());

const dbMember = _db.queryFirst("SELECT id FROM organization_profile WHERE uid = ?::uuid", uid);

if (!dbMember) {
  cluar.response.error({
    status: 404,
    error: `member not found with uid: ${uid}`,
    error_code: "member-not-found"
  });
}

_db.update(
  "organization_profile",
  dbMember.getInt("id"),
  _val.map()
    .set("active", active)
);

_out.json(
  _val.map()
    .set("result", true)
);
