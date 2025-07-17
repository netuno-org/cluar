const language = _req.getString("language");

const templates = [];
const templatesPath = _app.getPathBase() + "/website/src/components/Content";

if (_app.isFolder(templatesPath)) {
  const templatesFolder = _app.getFolder(templatesPath);
  const templatesFolders = templatesFolder.list();

  templatesFolders.forEach((templateFolder) => {
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

    templates.push({
      name: templateFolder.getName(),
      info: _val.fromJSON(fileContent).getValues(language),
    });
  });
}

_out.json({
  templates,
});
