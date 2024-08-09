cluar.build = (settings)=> {
  settings = settings || {}
  
  const folder = _app.folder(`${cluar.base()}/cluar`)
  if (!folder.exists()) {
    folder.mkdir()
  }

  const data = _val.map()

  data.set(
    "config",
    _app.settings.getValues("cluar", _val.map())
      .getValues("website", _val.map())
  )

  /*
   *
   *  LANGUAGES
   *
   */        
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
  data.set("languages", languages)
  
  /*
   *
   *  CONFIGURATION
   *
   */
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
  data.set("configuration", configuration)
  
  /*
   *
   *  DICTIONARY
   *
   */
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
  data.set("dictionary", dictionary)

  /*
   *
   *  PAGES
   *
   */
  const dbPages = _db.query(`
        SELECT
            page.id,
            page.uid,
            language.code "language",
            page.parent_id,
            page.link,
            page.title,
            page.description,
            page.keywords,
            page.navigable,
            page.menu,
            page.menu_title,
            page.sorter
        FROM language
            INNER JOIN page ON language.id = page.language_id
            INNER JOIN page_status ON page.status_id = page_status.id
        WHERE language.active = TRUE
            AND page.active = TRUE
            AND page_status.active = TRUE
            AND page_status.code = 'published'
        ORDER BY language.code, page.sorter, page.link
        `)
  const pages = _val.map()
  for (const dbPage of dbPages) {
    if (!pages.has(dbPage.getString("language"))) {
      pages.set(dbPage.getString("language"), _val.list())
    }
    let parentLink = ""
    if (dbPage.getInt("parent_id") > 0) {
      const dbParentPage = _db.findFirst(
        "page",
        _val.map()
          .set("where", _val.map().set("id", dbPage.getInt("parent_id")))
      )
      parentLink = dbParentPage.getString("link")
    }
    pages.getValues(dbPage.getString("language"))
      .add(
        _val.map()
          .set("uid", dbPage.getString("uid"))
          .set("parent", parentLink)
          .set("link", dbPage.getString("link"))
          .set("title", dbPage.getString("title"))
          .set("description", dbPage.getString("description"))
          .set("keywords", dbPage.getString("keywords"))
          .set("navigable", dbPage.getBoolean("navigable"))
          .set("menu", dbPage.getBoolean("menu"))
          .set("menu_title", dbPage.getString("menu_title"))
          .set("sorter", dbPage.getInt("sorter"))
          .set("structure", null)
      )
    cluar.page.publish(dbPage)
  }
  data.set("pages", pages)
  
  cluar.custom.build(settings, data)
  
  /*
   *
   *  MAIN FILE
   *
   */
  const file = _app.file(`${cluar.base()}/cluar/data.js`)
  file.output().print(`window.cluar = ${data.toJSON(4)};`).close()
  
  if (_app.settings.getValues('cluar', _val.map()).getBoolean("uglifyjs") == true) {
    const osUglifyJS = _os.init()
    osUglifyJS.directory(_app.folder(cluar.base()))
    const osUglifyJSResult = osUglifyJS.command(`uglifyjs -o cluar/data.js -- cluar/data.js`)
    if (osUglifyJSResult.output() != '' && osUglifyJSResult.error() != '') {
      _log.error(`UglifyJS failed:\n\tOutput: ${osUglifyJSResult.output()}\n\tError: ${osUglifyJSResult.error()}`)
    }
  }

  /*
   *
   *  SITEMAP & ROBOTS
   *
   */
  const origin = _app.settings.getValues("cluar", _val.map()).getValues("website", _val.map()).getString("url")
  const xml = _xml.create()
  const document = xml.builder().newDocument()
  const tagURLSet = document.createElement("urlset")
  const attrNS = document.createAttribute("xmlns")
  attrNS.setValue("http://www.sitemaps.org/schemas/sitemap/0.9")
  tagURLSet.setAttributeNode(attrNS)
  const attrNews = document.createAttribute("xmlns:news")
  attrNews.setValue("http://www.google.com/schemas/sitemap-news/0.9")
  tagURLSet.setAttributeNode(attrNews)
  const attrXHTML = document.createAttribute("xmlns:xhtml")
  attrXHTML.setValue("http://www.w3.org/1999/xhtml")
  tagURLSet.setAttributeNode(attrXHTML)
  const attrMobile = document.createAttribute("xmlns:mobile")
  attrMobile.setValue("http://www.sitemaps.org/schemas/sitemap/0.9")
  tagURLSet.setAttributeNode(attrMobile)
  const attrImage = document.createAttribute("xmlns:image")
  attrImage.setValue("http://www.google.com/schemas/sitemap-image/1.1")
  tagURLSet.setAttributeNode(attrImage)
  const attrVideo = document.createAttribute("xmlns:video")
  attrVideo.setValue("http://www.google.com/schemas/sitemap-video/1.1")
  tagURLSet.setAttributeNode(attrVideo)
  for (const language of languages) {
    if (pages.getValues(language.getString("code")) == null) {
      continue
    }
    for (const page of pages.getValues(language.getString("code"))) {
      if (page.getBoolean('navigable') == false) {
        continue
      }
      const tagURL = document.createElement("url")
      const tagLoc = document.createElement("loc")
      tagLoc.appendChild(document.createTextNode(origin +"/"+ language.getString("locale") + page.getString("link")))
      tagURL.appendChild(tagLoc)
      const tagChangeFreq = document.createElement("changefreq")
      tagChangeFreq.appendChild(document.createTextNode("daily"))
      tagURL.appendChild(tagChangeFreq)
      let priority = "0.5"
      if (page.getString("link") == '/') {
        priority = "1.0"
      } else if (page.getString("parent") == '') {
        priority = "0.7"
      }
      const tagPriority = document.createElement("priority")
      tagPriority.appendChild(document.createTextNode(priority))
      tagURL.appendChild(tagPriority)
      tagURLSet.appendChild(tagURL)
    }
  }
  cluar.custom.siteMap(origin, document, tagURLSet)
  document.appendChild(tagURLSet)
  xml.save(document, _app.file(`${cluar.base()}/sitemap.xml`))
  if (!_app.file(`${cluar.base()}/robots.txt`).exists()) {
    const output = _app.file(`${cluar.base()}/robots.txt`).output()
          .println('User-agent: *')
          .println('Allow: /')
          .println(`Sitemap: ${origin}/sitemap.xml`)
          .close()
  }
}
