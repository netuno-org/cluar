import { _db, _req, _out, _header, _exec, _storage } from "@netuno/server-types";

let dbProfile = null;

if (_req.getString('uid')) {
  dbProfile = _db.get('profile', _req.getString('uid'));
}

if (!dbProfile) {
  _header.status(404);
  _exec.stop();
}

const dbAvatarName = dbProfile.getString('avatar');

const storageAvatarFile = _storage.database(
  'profile',
  'avatar',
  dbAvatarName
);

if (storageAvatarFile.extension() == "jpg" || storageAvatarFile.extension() == "jpeg") {
  _header.contentTypeJPG();
} else {
  _header.contentTypePNG();
}
_header.noCache();

_out.copy(storageAvatarFile.inputStream());
