import { _val, _req, _app } from "@netuno/server-types";
import cluar from "#core/cluar/main.js";

const language = _req.getString("language");

const templatesData = _val.list();
const templatesPath = _app.getPathBase() + "/website/src/pages/Template";

if (_app.isFolder(templatesPath)) {
  const templatesFolder = _app.getFolder(templatesPath);
  const templatesFolders = templatesFolder.list();

  templatesFolders.forEach((templateFolder) => {
    const templateInfoPath = `${templateFolder.getFullPath()}/info.json`;

    if (!_app.isFile(templateInfoPath)) {
      return;
    }

    const file = _app.file(templateInfoPath);
    const fileContent = file.input().readAllAndClose();

    templatesData.add(
      _val.map()
        .set("name", templateFolder.getName())
        .set("info", _val.fromJSON(fileContent).getValues(language))
    );
  });
}

cluar.response.successWithData({
  status: 200,
  data: templatesData
});
