cluar.dataItemSavedWithImage = ()=> {
  const section = _dataItem.getTable()

  const folder = _app.folder(`${cluar.base()}/cluar/images/${section}`)
  
  if (!folder.exists()) {
    folder.mkdir()
  }

  if (_dataItem.getValues().has("image:old")) {
    _app.file(`${folder.path()}/${_dataItem.getValues().getString("image:old")}`).delete()
  }

  if (_dataItem.getValues().has("image:new")) {
    _storage.database(section, "image", _dataItem.getValues().getString("image:new"))
      .file()
      .copy(`${folder.path()}/${_dataItem.getValues().getString("image:new")}`)
  }
}
