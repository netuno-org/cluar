import { _val, _req, _app } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const language = _req.getString("language");

const typesData = _val.list();
const configData = _val.list();

const typesPath = _app.getPathBase() + "/website/src/components/Banner";

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

    typesData.add(
      _val.map()
        .set("name", templateFolder.getName())
        .set("info", _val.fromJSON(fileContent).getValues(language))
    );

    configData.add(
      _val.map()
        .set("name", templateFolder.getName())
        .set("action", _val.fromJSON(configContent).getBoolean("action"))
    );
  });
}

cluar.response.successWithData({
  status: 200,
  data: _val.map()
    .set("types", typesData)
    .set("config", configData)
});
