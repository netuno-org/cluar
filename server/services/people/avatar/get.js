let dbPeople = null

if (_req.getString('uid')) {
  dbPeople = _db.get('people', _req.getString('uid'))
}

if (!dbPeople) {
  _header.status(404)
  _exec.stop()
}

const dbAvatarName = dbPeople.getString('avatar')

const storageAvatarFile = _storage.database(
  'people',
  'avatar',
  dbAvatarName
)

if (storageAvatarFile.extension() == "jpg" || storageAvatarFile.extension() == "jpeg") {
  _header.contentTypeJPG()
} else {
  _header.contentTypePNG()
}
_header.noCache()

_out.copy(storageAvatarFile.inputStream())