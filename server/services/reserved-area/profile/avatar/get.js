import { _db, _req, _out, _header, _storage } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

let dbProfile = null;

if (_req.getString("uid")) {
  dbProfile = _db.get("profile", _req.getString("uid"));
}

if (!dbProfile) {
  cluar.response.error({
    status: 404,
    error_code: "profile-not-found",
    error: "profile not found"
  });
}

const dbAvatarName = dbProfile.getString("avatar");

const storageAvatarFile = _storage.database(
  "profile",
  "avatar",
  dbAvatarName
);

if (storageAvatarFile.extension() == "jpg" || storageAvatarFile.extension() == "jpeg") {
  _header.contentTypeJPG();
} else {
  _header.contentTypePNG();
}
_header.noCache();

_out.copy(storageAvatarFile.inputStream());
