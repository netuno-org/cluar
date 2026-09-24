import { _db, _val, _req, _out } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const {
  uid,
  active
} = JSON.parse(_req.toJSON());

const dbOrganization = _db.queryFirst("SELECT * FROM organization WHERE uid = ?::uuid", uid);

if (!dbOrganization) {
  cluar.response.error({
    status: 404,
    error_code: "organization-not-found",
    error: `organization not found with uid: ${uid}`
  });
}

_db.update(
  "organization",
  dbOrganization.getInt("id"),
  _val.map()
    .set("active", active)
);

_out.json({ result: true });
