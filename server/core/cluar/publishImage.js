cluar.publishImage = (section, fileName)=> {
  if (fileName == "") {
    return;
  }
  const folder = _app.folder(`${cluar.base()}/cluar/images/page_${section}`)
  if (!folder.exists()) {
    folder.mkdirs()
  }
  const websiteFile = _app.file(`${folder.path()}/${fileName}`)
  const databaseFile = _storage.database(`page_${section}`, "image", fileName).file()
  if (!websiteFile.exists()
      || databaseFile.available() != websiteFile.available()
      || databaseFile.lastModified() > websiteFile.lastModified()) {
    _storage.database(`page_${section}`, "image", fileName)
      .file()
      .copy(`${folder.path()}/${fileName}`, true)
  }
}

cluar.publishPageSocialImage = (fileName)=> {
  if (fileName == "") {
    return;
  }
  const folder = _app.folder(`${cluar.base()}/cluar/images/page`)
  if (!folder.exists()) {
    folder.mkdirs()
  }
  const websiteFile = _app.file(`${folder.path()}/${fileName}`)
  const databaseFile = _storage.database("page", "social_image", fileName).file()
  if (!websiteFile.exists()
      || databaseFile.available() != websiteFile.available()
      || databaseFile.lastModified() > websiteFile.lastModified()) {
    _storage.database("page", "social_image", fileName)
      .file()
      .copy(`${folder.path()}/${fileName}`, true)
  }
}
