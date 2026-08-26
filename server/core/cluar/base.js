import { _env, _app, _config, _val, _db, _storage, _html } from "@netuno/server-types";

const basePath = () => {
  if (_env.is("dev")) {
    return "website/public";
  } else {
    return "website/dist";
  }
};

/*
 * Parâmetros de configuração do tipo "image" que devem ser sempre
 * gravados na MESMA pasta e com o MESMO nome de ficheiro em disco,
 * independentemente do nome que o Netuno atribuiu ao upload
 * (configuration.value_img).
 *
 * Isto é essencial para imagens referenciadas fora do React/JS
 * (ex: favicon em <link rel="icon">, manifest.json), porque essas
 * referências são estáticas e não podem mudar a cada upload -
 * só o conteúdo do ficheiro é substituído.
 *
 * Por omissão (parâmetro não listado aqui), mantém-se o comportamento
 * já existente: pasta "cluar/images/configuration" + nome gerado pelo
 * Netuno no upload (ex: o "logo").
 */
const FIXED_IMAGE_LOCATION = {
  "favicon": { folder: "images", fileName: "favicon.png" },
};

const configurationImageLocation = (parameterCode, uploadedFileName) => {
  const fixed = FIXED_IMAGE_LOCATION[parameterCode];
  if (fixed) {
    return { folder: fixed.folder, fileName: fixed.fileName };
  }
  return { folder: "cluar/images/configuration", fileName: uploadedFileName };
};

export default {
  basePath,
  FIXED_IMAGE_LOCATION,
  configurationImageLocation,

  /*
   * URL público para mostrar a imagem de um parâmetro de configuração
   * (usado no admin - tabela e modal de Configurações). Único sítio que
   * sabe traduzir parameterCode + value_img para o caminho final, para
   * o React nunca ter de reconstruir o caminho à mão (foi essa
   * reconstrução manual, desatualizada em relação ao FIXED_IMAGE_LOCATION,
   * que causava a imagem "corrompida" no admin para o favicon).
   *
   * A query ?v= evita que o browser mostre uma versão em cache antiga
   * quando a imagem é substituída num caminho fixo (ex: favicon).
   */
  configurationImageUrl: (parameterCode, uploadedFileName) => {
    if (!uploadedFileName) {
      return null;
    }
    const location = configurationImageLocation(parameterCode, uploadedFileName);
    const file = _app.file(`${basePath()}/${location.folder}/${location.fileName}`);
    const version = file.exists() ? file.lastModified() : 0;
    return `/${location.folder}/${location.fileName}?v=${version}`;
  },

  configuration: () => {
    if (_config.has("cluar:base:configuration")) {
      return _config.getValues("cluar:base:configuration");
    }

    const configuration = _val.map();
    const dbConfigurationWithLanguages = _db.query(`
        SELECT
            language.code "language",
            configuration_parameter.code "code",
            configuration.value_img,
            configuration.${_db.escape('value')}
        FROM language
            INNER JOIN configuration ON language.id = configuration.language_id
            INNER JOIN configuration_parameter ON configuration.parameter_id = configuration_parameter.id
        WHERE language.active = TRUE
            AND configuration.active = TRUE
            AND configuration_parameter.active = TRUE
        ORDER BY language.code, configuration_parameter.code
    `);
    for (const dbParameter of dbConfigurationWithLanguages) {
      if (!configuration.has(dbParameter.getString("language"))) {
        configuration.set(dbParameter.getString("language"), _val.map());
      }

      const uploadedFileName = dbParameter.getString("value_img");

      if (uploadedFileName) {
        const location = configurationImageLocation(
          dbParameter.getString("code"), uploadedFileName
        );
        const folder = _app.folder(`${basePath()}/${location.folder}`);
        if (!folder.exists()) {
          folder.mkdirs();
        }
        const websiteFile = _app.file(`${folder.path()}/${location.fileName}`);
        const databaseFile = _storage.database(`configuration`, "value_img", uploadedFileName).file();
        if (!websiteFile.exists()
          || databaseFile.available() != websiteFile.available()
          || databaseFile.lastModified() > websiteFile.lastModified()) {
          databaseFile.copy(`${folder.path()}/${location.fileName}`, true);
        }

        configuration.getValues(dbParameter.getString("language"))
          .set(dbParameter.getString("code"), `/${location.folder}/${location.fileName}`);
      } else {
        configuration.getValues(dbParameter.getString("language"))
          .set(dbParameter.getString("code"), dbParameter.getString("value"));
      }
    }
    const dbConfigurationWithoutLanguages = _db.query(`
        SELECT
            configuration_parameter.code "code",
            configuration.value_img,
            configuration.${_db.escape('value')}
        FROM configuration
            INNER JOIN configuration_parameter ON configuration.parameter_id = configuration_parameter.id
        WHERE (configuration.language_id = 0 OR configuration.language_id IS NULL)
            AND configuration.active = TRUE
            AND configuration_parameter.active = TRUE
        ORDER BY configuration_parameter.code
    `);
    for (const dbParameter of dbConfigurationWithoutLanguages) {
      if (!configuration.has("GENERIC")) {
        configuration.set("GENERIC", _val.map());
      }

      const uploadedFileName = dbParameter.getString("value_img");

      if (uploadedFileName) {
        const location = configurationImageLocation(
          dbParameter.getString("code"), uploadedFileName
        );
        const folder = _app.folder(`${basePath()}/${location.folder}`);
        if (!folder.exists()) {
          folder.mkdirs();
        }
        const websiteFile = _app.file(`${folder.path()}/${location.fileName}`);
        const databaseFile = _storage.database(`configuration`, "value_img", uploadedFileName).file();
        if (!websiteFile.exists()
          || databaseFile.available() != websiteFile.available()
          || databaseFile.lastModified() > websiteFile.lastModified()) {
          databaseFile.copy(`${folder.path()}/${location.fileName}`, true);
        }

        configuration.getValues("GENERIC")
          .set(dbParameter.getString("code"), `/${location.folder}/${location.fileName}`);
      } else {
        configuration.getValues("GENERIC")
          .set(dbParameter.getString("code"), dbParameter.getString("value"));
      }
    }
    _config.set("cluar:base:configuration", configuration);
    return configuration;
  },

  /*
   *
   *  ÍCONE (favicon) + TÍTULO + ROOT.CSS (cores do arranque, antes do React montar)
   *
   *  Esta função só toca em ficheiros "de raiz" (website/index.html e
   *  website/dist/index.html) e no root.css - nunca em páginas já
   *  publicadas. Por isso o custo é sempre o mesmo, independentemente de
   *  o website ter 1 ou 1000 páginas publicadas.
   *
   *  - Favicon: só troca a imagem (ver configurationImageLocation).
   *  - Título: é texto dentro do <title>, obriga a reescrever esse nó nos
   *    2 ficheiros raiz (não há como isto ser um recurso partilhado).
   *  - Cores: em vez de embutidas por página, ficam num único root.css
   *    partilhado por TODAS as páginas (<link id="cluar-configuration"
   *    href="/root.css">, já presente no index.html). Uma gravação de
   *    configuração só reescreve este ficheiro - nunca republica páginas.
   *
   *  Propagação às páginas já publicadas:
   *  - Cores -> automática e imediata, porque todas apontam para o mesmo
   *    root.css (é só um ficheiro estático a ser sobrescrito).
   *  - Título -> só afeta o <title> do "molde" (website/dist/index.html);
   *    cada página já publicada mantém sempre o seu próprio título, que
   *    nunca vem daqui (ver dbPage.getString("title") em page/publish.js).
   *  - Favicon -> automática e imediata, mesma razão que as cores.
   *  Ou seja: NENHUM destes 3 precisa de republicar páginas. Só é preciso
   *  publicar/republicar manualmente (botão de sincronização) se algo
   *  MAIS além destes 3 tiver mudado (ex: menu de navegação).
   */
  applyConfigurationToIndexHtml: (configuration) => {
    const generic = configuration.getValues("GENERIC") || _val.map();

    const title = generic.getString("title");
    const primaryColor = generic.getString("primary-color");
    const backgroundColorLight = generic.getString("background-color-light");
    const backgroundColorDark = generic.getString("background-color-dark");

    let cssOverrides = ":root {";
    if (primaryColor) {
      cssOverrides += `--cluar-loading-color: ${primaryColor};`;
    }
    if (backgroundColorLight) {
      cssOverrides += `--cluar-bg-light: ${backgroundColorLight};`;
    }
    if (backgroundColorDark) {
      cssOverrides += `--cluar-bg-dark: ${backgroundColorDark};`;
    }
    cssOverrides += "}\n";

    const faviconLocation = FIXED_IMAGE_LOCATION["favicon"];

    /*
     * website/index.html (fonte) usa as imagens/root.css de website/public/...
     * website/dist/index.html (compilado) usa as de website/dist/...
     * são as mesmas duas bases que cluar.basePath() já alterna consoante o
     * ambiente - aqui percorremos as duas sempre, independentemente do
     * ambiente atual, para nenhuma delas ficar desatualizada.
     */
    const targets = [
      { indexHtml: "website/index.html", base: "website/public" },
      { indexHtml: "website/dist/index.html", base: "website/dist" },
    ];

    for (const target of targets) {
      const baseFolder = _app.folder(target.base);
      if (!baseFolder.exists()) {
        continue;
      }

      /*
       * root.css - ficheiro único e barato de reescrever, independente
       * de haver 1 ou 1000 páginas publicadas.
       */
      const rootCssFile = _app.file(`${target.base}/root.css`);
      rootCssFile.output().print(cssOverrides).close();

      const indexHtmlFile = _app.file(target.indexHtml);
      if (!indexHtmlFile.exists()) {
        continue;
      }

      const document = _html.parse(indexHtmlFile, "UTF-8", "");
      const headElement = document.select("head").first();
      if (!headElement) {
        continue;
      }

      if (title) {
        const titleElement = headElement.selectFirst("title");
        if (titleElement) {
          titleElement.text(title);
        } else {
          headElement.appendElement("title").text(title);
        }
      }

      /*
       * Cache-busting do favicon: o browser guarda em cache de forma muito
       * agressiva um ícone servido sempre no mesmo URL. Ao acrescentar
       * ?v=<data de modificação do ficheiro> ao href, o URL muda sempre
       * que a imagem é substituída, obrigando o browser a pedir de novo.
       * (root.css NÃO tem este tratamento de propósito - CSS é bem menos
       * agressivamente cacheado pelos browsers do que favicons, e não vale
       * o custo de reescrever 2 ficheiros a mais por causa disso; se algum
       * dia for preciso forçar, isso fica para a sincronização manual.)
       */
      const faviconFile = _app.file(
        `${target.base}/${faviconLocation.folder}/${faviconLocation.fileName}`
      );
      if (faviconFile.exists()) {
        const iconElement = headElement.selectFirst("link[rel=icon]");
        if (iconElement) {
          iconElement.attr(
            "href",
            `/${faviconLocation.folder}/${faviconLocation.fileName}?v=${faviconFile.lastModified()}`
          );
        }
      }

      indexHtmlFile.output().print(document.outerHtml()).close();
    }
  },

  /*
   *
   *  DICTIONARY
   *
   */

  dictionary: () => {
    if (_config.has("cluar:base:dictionary")) {
      return _config.getValues("cluar:base:dictionary");
    }

    const dbDictionary = _db.query(`
        SELECT
            language.code "language",
            dictionary_entry.code "code",
            dictionary.${_db.escape('value')}
        FROM language
            INNER JOIN dictionary ON dictionary.language_id = language.id
            INNER JOIN dictionary_entry ON dictionary.entry_id = dictionary_entry.id
        WHERE language.active = TRUE
            AND dictionary.active = TRUE
            AND dictionary_entry.active = TRUE
        ORDER BY language.code, dictionary_entry.code
    `);
    const dictionary = _val.map();
    for (const dbEntry of dbDictionary) {
      if (!dictionary.has(dbEntry.getString("language"))) {
        dictionary.set(dbEntry.getString("language"), _val.map());
      }
      dictionary.getValues(dbEntry.getString("language"))
        .set(dbEntry.getString("code"), dbEntry.getString("value"));
    }

    _config.set("cluar:base:dictionary", dictionary);

    return dictionary;
  },

  /*
   *
   *  PAGES
   *
   */

  pages: ({ publishFn = null }) => {
    if (_config.has("cluar:base:pages")) {
      return _config.getValues("cluar:base:pages");
    }

    const dbPages = _db.query(`
        SELECT
            page.id,
            page.uid,
            page_version.uid "page_version_uid",
            language.code "language",
            page.parent_id,
            page.link,
            page.title,
            page.description,
            page.keywords,
            page.navigable,
            page.menu,
            page.menu_title,
            page.sorter,
            page.social_image,
            page.template
        FROM language
            INNER JOIN page ON language.id = page.language_id
        INNER JOIN page_version ON page_version.page_id = page.id
            INNER JOIN page_status ON page_version.status_id = page_status.id
        WHERE language.active = TRUE
            AND page.active = TRUE
            AND page_status.active = TRUE
            AND page_status.code = 'published'
        ORDER BY language.code, page.sorter, page.link
    `);
    const pages = _val.map();
    for (const dbPage of dbPages) {
      if (!pages.has(dbPage.getString("language"))) {
        pages.set(dbPage.getString("language"), _val.list());
      }
      let parentLink = "";
      let parentUid = "";
      if (dbPage.getInt("parent_id") > 0) {
        const dbParentPage = _db.findFirst(
          "page",
          _val
            .map()
            .set("where", _val.map().set("id", dbPage.getInt("parent_id")))
        );
        parentLink = dbParentPage.getString("link");
        parentUid = dbParentPage.getString("uid");
      }
      pages
        .getValues(dbPage.getString("language"))
        .add(
          _val
            .map()
            .set("uid", dbPage.getString("uid"))
            .set("parent", parentLink)
            .set("parent_uid", parentUid)
            .set("link", dbPage.getString("link"))
            .set("title", dbPage.getString("title"))
            .set("description", dbPage.getString("description"))
            .set("keywords", dbPage.getString("keywords"))
            .set("navigable", dbPage.getBoolean("navigable"))
            .set("menu", dbPage.getBoolean("menu"))
            .set("menu_title", dbPage.getString("menu_title"))
            .set("sorter", dbPage.getInt("sorter"))
            .set("structure", null)
            .set("social_image", dbPage.getString("social_image"))
            .set("page_version_uid", dbPage.getString("page_version_uid"))
            .set("template", dbPage.getString("template"))
        );

      if (publishFn) {
        publishFn(dbPage);
      }
    }

    _config.set("cluar:base:pages", pages);

    return pages;
  },

  /*
   *
   *  LANGUAGES
   *
   */

  languages: () => {
    if (_config.has("cluar:base:languages")) {
      return _config.getValues("cluar:base:languages");
    }

    const dbLanguages = _db.find(
      'language',
      _val.map()
        .set(
          'where',
          _val.map()
            .set("active", true)
        )
    );
    const languages = _val.list();

    for (const dbLanguage of dbLanguages) {
      languages.add(
        _val.map()
          .set("code", dbLanguage.getString("code"))
          .set("locale", dbLanguage.getString("locale"))
          .set("description", dbLanguage.getString("description"))
          .set("default", dbLanguage.getBoolean("default"))
      );
    }

    _config.set("cluar:base:languages", languages);

    return languages;
  },

  /*
   *
   *  ACTIONS
   *
   */

  actions: () => {
    if (_config.has("cluar:base:actions")) {
      return _config.getValues("cluar:base:actions");
    }
    const dbActions = _db.query(`
        SELECT
            action.uid,
            action.title,
            action.content,
            action.indication,
            action.link,
            action.active,
            action.image,
            language.code "language"
        FROM language
        INNER JOIN action ON language.id = action.language_id
        WHERE language.active = TRUE
    `);
    const actions = _val.list();
    for (const dbAction of dbActions) {
      actions.add(
        _val.map()
          .set("uid", dbAction.getString("uid"))
          .set("title", dbAction.getString("title"))
          .set("content", dbAction.getString("content"))
          .set("indication", dbAction.getString("indication"))
          .set("link", dbAction.getString("link"))
          .set("active", dbAction.getBoolean("active"))
          .set("image", dbAction.getString("image"))
          .set("language_code", dbAction.getString("language"))
      );
    }
    _config.set("cluar:base:actions", actions);

    return actions;
  }
};
