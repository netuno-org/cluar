const language = _req.getString("language");

const types = [];
const typesPath = _app.getPathBase() + "/website/src/components/Slider";

if (_app.isFolder(typesPath)) {
  const typesFolder = _app.getFolder(typesPath);
  const typesFolders = typesFolder.list();

  typesFolders.forEach((templateFolder) => {
    const templateInfoPath = `${templateFolder.getFullPath()}/info.json`;

    if (!_app.isFile(templateInfoPath)) {
      return;
    }

    const file = _app.file(templateInfoPath);
    const reader = file.bufferedReader();

    let fileContent = "";
    let line = reader.readLine();
    while (line) {
      fileContent += line;
      line = reader.readLine();
    }

    reader.close();

    types.push({
      name: templateFolder.getName(),
      info: _val.fromJSON(fileContent).getValues(language),
    });
  });
}

_out.json({
  types: types,
});
