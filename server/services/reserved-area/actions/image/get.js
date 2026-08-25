let dbAction = null

if (_req.getString('uid')) {
  dbAction = _db.get('action', _req.getString('uid'))
}

if (!dbAction) {
  _header.status(404)
  _exec.stop()
}

const dbImageName = dbAction.getString('image')

const storageImageFile = _storage.database(
  'action',
  'image',
  dbImageName
)

if (storageImageFile.extension() == "jpg" || storageImageFile.extension() == "jpeg") {
  _header.contentTypeJPG()
} else {
  _header.contentTypePNG()
}
_header.noCache()

_out.copy(storageImageFile.inputStream())