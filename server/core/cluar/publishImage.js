cluar.publishImage = (section, fileName)=> {
  if (fileName == "") {
    return;
  }
  const folder = _app.folder(`${cluar.base()}/images/${section}`)
  if (!folder.exists()) {
    folder.mkdir()
  }
  const websiteFile = _app.file(`${folder.path()}/${fileName}`)
  const databaseFile = _storage.database(section, "image", fileName).file()
  if (!websiteFile.exists()
      || databaseFile.available() != websiteFile.available()
      || databaseFile.lastModified() > websiteFile.lastModified()) {
    _storage.database(section, "image", fileName)
      .file()
      .copy(`${folder.path()}/${fileName}`, true)
  }
}

cluar.publishSocialImage = (fileName)=> {
  if (fileName == "") {
    return;
  }
  const folder = _app.folder(`/website/dist/images`)
  if (!folder.exists()) {
    folder.mkdir()
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
