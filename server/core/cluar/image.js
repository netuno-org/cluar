import { _app, _storage } from "@netuno/server-types";
import base from "#core/cluar/base.js";

export default {
  publish: (section, fileName) => {
    if (fileName == "") {
      return;
    }
    const folder = _app.folder(`${base.basePath()}/cluar/images/page_${section}`)
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
  },

  publishSocial: (fileName) => {
    if (fileName == "") {
      return;
    }
    const folder = _app.folder(`${base.basePath()}/cluar/images/page`)
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
};
