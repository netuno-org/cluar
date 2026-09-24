import { _db, _req, _out, _header, _storage } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

let dbAction = null;

if (_req.getString("uid")) {
  dbAction = _db.get("action", _req.getString("uid"));
}

if (!dbAction) {
  cluar.response.error({
    status: 404,
    error_code: "action-not-found",
    error: "action not found"
  });
}

const dbImageName = dbAction.getString("image");

const storageImageFile = _storage.database(
  "action",
  "image",
  dbImageName
);

if (storageImageFile.extension() == "jpg" || storageImageFile.extension() == "jpeg") {
  _header.contentTypeJPG();
} else {
  _header.contentTypePNG();
}
_header.noCache();

_out.copy(storageImageFile.inputStream());
