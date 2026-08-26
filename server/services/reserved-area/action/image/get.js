import { _db, _req, _out, _header, _exec, _storage } from "@netuno/server-types";

let dbAction = null;

if (_req.getString('uid')) {
  dbAction = _db.get('action', _req.getString('uid'));
}

if (!dbAction) {
  _header.status(404);
  _exec.stop();
}

const dbImageName = dbAction.getString('image');

const storageImageFile = _storage.database(
  'action',
  'image',
  dbImageName
);

if (storageImageFile.extension() == "jpg" || storageImageFile.extension() == "jpeg") {
  _header.contentTypeJPG();
} else {
  _header.contentTypePNG();
}
_header.noCache();

_out.copy(storageImageFile.inputStream());
