const language = _req.getString("language");

const types = [];
const config = [];

const typesPath = _app.getPathBase() + "/website/src/components/Slider";

if (_app.isFolder(typesPath)) {
  const typesFolder = _app.getFolder(typesPath);
  const typesFolders = typesFolder.list();

  typesFolders.forEach((templateFolder) => {
    const templateInfoPath = `${templateFolder.getFullPath()}/info.json`;
    const configPath = `${templateFolder.getFullPath()}/config.json`;

    if (!_app.isFile(templateInfoPath)) {
      return;
    }

    const file = _app.file(templateInfoPath);
    const fileContent = file.input().readAllAndClose();

    const configFile = _app.file(configPath);
    const configContent = configFile.input().readAllAndClose();

    types.push({
      name: templateFolder.getName(),
      info: _val.fromJSON(fileContent).getValues(language),
    });

    config.push({
      name: templateFolder.getName(),
      action: _val.fromJSON(configContent).getBoolean("action"),
    })
  });
}

_out.json({
  types: types,
  config: config,
});
