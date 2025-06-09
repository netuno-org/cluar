const language = _req.getString("language");

const templatesPath = _app.getPathBase() + "/website/src/templates";
const command = _os.command("ls " + templatesPath);

const entries = command.getOutput().split("\n");

const templates = [];
for (const entrie of entries) {
  const templatePath = `${templatesPath}/${entrie}/info.json`;

  if (!_app.isFile(templatePath)) {
    continue;
  }

  const file = _app.file(templatePath);
  const reader = file.bufferedReader()

  let fileContent = "";
  let line = reader.readLine();
  while (line) {
    fileContent += line;
    line = reader.readLine();
  }

  reader.close();

  templates.push({
    name: entrie,
    info: _val.fromJSON(fileContent).getValues(language)
  });
}

_out.json({
  templates
});
