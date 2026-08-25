const language = _req.getString("language");

const templates = [];
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

    templates.push({
      name: templateFolder.getName(),
      info: _val.fromJSON(fileContent).getValues(language),
    });
  });
}

_out.json({
  templates,
});
