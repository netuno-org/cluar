const cluar = { page: {}, custom: {} }

cluar.base = () => {
  if (_env.is("dev")) {
    return "website/public"
  } else {
    return "website/dist"
  }
}

cluar.base.configuration = () => {
  if (_config.has("cluar:base:configuration")) {
    return _config.getValues("cluar:base:configuration");
  }

  //_log.debug("BASE CLUAR CORE");

  const configuration = _val.map()
  const dbConfigurationWithLanguages = _db.query(`
        SELECT
            language.code "language",
            configuration_parameter.code "code",
            configuration.${_db.escape('value')}
        FROM language
            INNER JOIN configuration ON language.id = configuration.language_id
            INNER JOIN configuration_parameter ON configuration.parameter_id = configuration_parameter.id
        WHERE language.active = TRUE
            AND configuration.active = TRUE
            AND configuration_parameter.active = TRUE
        ORDER BY language.code, configuration_parameter.code
        `)
  for (const dbParameter of dbConfigurationWithLanguages) {
    if (!configuration.has(dbParameter.getString("language"))) {
      configuration.set(dbParameter.getString("language"), _val.map())
    }
    configuration.getValues(dbParameter.getString("language"))
      .set(dbParameter.getString("code"), dbParameter.getString("value"))
  }
  const dbConfigurationWithoutLanguages = _db.query(`
        SELECT
            configuration_parameter.code "code",
            configuration.${_db.escape('value')}
        FROM configuration
            INNER JOIN configuration_parameter ON configuration.parameter_id = configuration_parameter.id
        WHERE (configuration.language_id = 0 OR configuration.language_id IS NULL)
            AND configuration.active = TRUE
            AND configuration_parameter.active = TRUE
        ORDER BY configuration_parameter.code
        `)
  for (const dbParameter of dbConfigurationWithoutLanguages) {
    if (!configuration.has("GENERIC")) {
      configuration.set("GENERIC", _val.map())
    }
    configuration.getValues("GENERIC")
      .set(dbParameter.getString("code"), dbParameter.getString("value"))
  }
  _config.set("cluar:base:configuration", configuration)
  return configuration;
}

/*
  *
  *  DICTIONARY
  *
  */

cluar.base.dictionary = () => {
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
        `)
  const dictionary = _val.map()
  for (const dbEntry of dbDictionary) {
    if (!dictionary.has(dbEntry.getString("language"))) {
      dictionary.set(dbEntry.getString("language"), _val.map())
    }
    dictionary.getValues(dbEntry.getString("language"))
      .set(dbEntry.getString("code"), dbEntry.getString("value"))
  }

  _config.set("cluar:base:dictionary", dictionary)

  return dictionary;
}

/*
  *
  *  PAGES
  *
  */

cluar.base.pages = ({ publish = false }) => {
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

    if (publish) {
      cluar.page.publish(dbPage);
    }
  }

  //_log.debug("pages", pages);

  _config.set("cluar:base:pages", pages)

  return pages;
}

/*
  *
  *  LANGUAGES
  *
  */

cluar.base.languages = () => {
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
  )
  const languages = _val.list()

  for (const dbLanguage of dbLanguages) {
    languages.add(
      _val.map()
        .set("code", dbLanguage.getString("code"))
        .set("locale", dbLanguage.getString("locale"))
        .set("description", dbLanguage.getString("description"))
        .set("default", dbLanguage.getBoolean("default"))
    )
  }

  _config.set("cluar:base:languages", languages)

  return languages;
}

/*
  *
  *  ACTIONS
  *
  */

cluar.base.actions = () => {
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
  const actions = _val.list()
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
    )
  }
  //_log.debug("actions", actions);
  _config.set("cluar:base:actions", actions)

  return actions;
}
