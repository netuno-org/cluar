import { _dataItem, _db, _user, _val } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const data = _dataItem.getRecord();
const lastPageVersion = _db.queryFirst(`
    SELECT
        p.id,
        pv.version
    FROM page_version pv
    INNER JOIN page p ON p.id = pv.page_id
    WHERE p.id = '${data.getInt("id")}'
    ORDER BY pv.version DESC
`);

const profileId = _db.queryFirst(`
    SELECT profile.id
    FROM profile
    WHERE profile.profile_user_id = ${_db.param("int")}
  `,
  _user.id()).getInt("id");

if (!lastPageVersion) {
  _db.insert(
    "page_version",
    _val
      .map()
      .set("page_id", data.getInt("id"))
      .set("version", 1)
      .set("status_id", data.getInt("status_id"))
      .set("created_at", _db.timestamp())
      .set("profile_id", profileId)
  );
}

cluar.page.publish(_dataItem.getRecord());
cluar.build();
