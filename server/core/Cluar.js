
// _core : CluarCustomData

class Cluar {

    static base() {
        if (_env.is("dev")) {
            return "website/public"
        } else {
            return "website/build"
        }
    }
    
    static build(settings) {
        settings = settings || {}
        
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
            configuration.value
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
            configuration.value
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
            dictionary.value
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

            const structure = _val.list()

            /*
             *
             *  CONTENTS
             *
             */
            const dbContents = _db.query(`
            SELECT
                content.id,
                content.uid,
                content_type.code "type",
                content.title,
                content.content,
                content.image,
                content.image_alt,
                content.image_title,
                content.image_max_width,
                content.sorter
            FROM content
                INNER JOIN content_type ON content.type_id = content_type.id
            WHERE content.active = TRUE
                AND content_type.active = TRUE
                AND content.page_id = ${dbPage.getInt("id")}
            `)
            for (const dbContent of dbContents) {
                structure.add(
                    _val.map()
                        .set("uid", dbContent.getString("uid"))
                        .set("section", "content")
                        .set("type", dbContent.getString("type"))
                        .set("title", dbContent.getString("title"))
                        .set("content", dbContent.getString("content"))
                        .set("image", dbContent.getString("image"))
                        .set("image_alt", dbContent.getString("image_alt"))
                        .set("image_title", dbContent.getString("image_title"))
                        .set("image_max_width", dbContent.getString("image_max_width"))
                        .set("sorter", dbContent.getInt("sorter"))
                        .set("actions", Cluar.actions("content", dbContent.getInt("id")))
                )
                if (settings.images === true) {
                    Cluar.publishImage("content", dbContent.getString("image"))
                }
            }

            /*
             *
             *  BANNERS
             *
             */
            const dbBanners = _db.query(`
            SELECT
                banner.id,
                banner.uid,
                banner_type.code "type",
                banner.title,
                banner.content,
                banner.image,
                banner.image_alt,
                banner.image_title,
                banner.sorter,
                banner.position_x,
                banner.position_y
            FROM banner
                INNER JOIN banner_type ON banner.type_id = banner_type.id
            WHERE banner.active = TRUE
                AND banner_type.active = TRUE
                AND banner.page_id = ${dbPage.getInt("id")}
            `)
            for (const dbBanner of dbBanners) {
                structure.add(
                    _val.map()
                        .set("uid", dbBanner.getString("uid"))
                        .set("section", "banner")
                        .set("type", dbBanner.getString("type"))
                        .set("title", dbBanner.getString("title"))
                        .set("content", dbBanner.getString("content"))
                        .set("image", dbBanner.getString("image"))
                        .set("image_alt", dbBanner.getString("image_alt"))
                        .set("image_title", dbBanner.getString("image_title"))
                        .set("sorter", dbBanner.getInt("sorter"))
                        .set(
                            "position",
                            _val.map()
                                .set("x", dbBanner.getString("position_x"))
                                .set("y", dbBanner.getString("position_y"))
                        )
                        .set("actions", Cluar.actions("banner", dbBanner.getInt("id")))
                )
                if (settings.images === true) {
                    Cluar.publishImage("banner", dbBanner.getString("image"))
                }
            }

            /*
             *
             *  LISTING
             *
             */
            const dbListings = _db.query(`
            SELECT
                listing.id,
                listing.uid,
                listing_type.code "type",
                listing.title,
                listing.image_alt,
                listing.image_title,
                listing.content,
                listing.image,
                listing.sorter
            FROM listing
                INNER JOIN listing_type ON listing.type_id = listing_type.id
            WHERE listing.active = TRUE
                AND listing_type.active = TRUE
                AND listing.page_id = ${dbPage.getInt("id")}
            `)
            for (const dbListing of dbListings) {
                const items = _val.list()
                const dbItems = _db.query(`
                SELECT
                    uid, title, content, image, image_alt, image_title, sorter, link
                FROM listing_item
                WHERE listing_id = ${dbListing.getInt("id")} AND active = TRUE
                `)
                for (const dbItem of dbItems) {
                    items.add(
                        _val.map()
                            .set("uid", dbItem.getString("uid"))
                            .set("section", "listing_item")
                            .set("title", dbItem.getString("title"))
                            .set("content", dbItem.getString("content"))
                            .set("image", dbItem.getString("image"))
                            .set("image_alt", dbItem.getString("image_alt"))
                            .set("image_title", dbItem.getString("image_title"))
                            .set("sorter", dbItem.getInt("sorter"))
                            .set("link", dbItem.getString("link"))
                    )
                    if (settings.images === true) {
                        Cluar.publishImage("listing_item", dbItem.getString("image"))
                    }
                }
                structure.add(
                    _val.map()
                        .set("uid", dbListing.getString("uid"))
                        .set("section", "listing")
                        .set("type", dbListing.getString("type"))
                        .set("title", dbListing.getString("title"))
                        .set("content", dbListing.getString("content"))
                        .set("image", dbListing.getString("image"))
                        .set("image_alt", dbListing.getString("image_alt"))
                        .set("image_title", dbListing.getString("image_title"))
                        .set("items", items)
                        .set("sorter", dbListing.getInt("sorter"))
                )
                if (settings.images === true) {
                    Cluar.publishImage("listing", dbListing.getString("image"))
                }
            }

            /*
             *
             *  FUNCTIONALITY
             *
             */
            const dbFunctionalities = _db.query(`
            SELECT
                functionality.id,
                functionality.uid,
                functionality_type.code "type",
                functionality.title,
                functionality.content,
                functionality.image,
                functionality.sorter
            FROM functionality
                INNER JOIN functionality_type ON functionality.type_id = functionality_type.id
            WHERE functionality.active = TRUE
                AND functionality_type.active = TRUE
                AND functionality.page_id = ${dbPage.getInt("id")}
            `)
            for (const dbFunctionality of dbFunctionalities) {
                structure.add(
                    _val.map()
                        .set("uid", dbFunctionality.getString("uid"))
                        .set("section", "functionality")
                        .set("type", dbFunctionality.getString("type"))
                        .set("title", dbFunctionality.getString("title"))
                        .set("content", dbFunctionality.getString("content"))
                        .set("image", dbFunctionality.getString("image"))
                        .set("sorter", dbFunctionality.getInt("sorter"))
                )
                if (settings.images === true) {
                    Cluar.publishImage("functionality", dbFunctionality.getString("image"))
                }
            }

            structure.sort((a, b) => a.getInt("sorter") - b.getInt("sorter"))
            
            /*
             *
             *  ADD PAGE
             *
             */       
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
                        .set("structure", structure)
                )
        }
        data.set("pages", pages)
        
        CluarCustomData(data)
        
        /*
         *
         *  DATA FILE
         *
         */
        const file = _app.file(`${Cluar.base()}/cluarData.js`)
        file.output().print(`window.cluarData = ${data.toJSON(4)};`)
        
        if (_app.settings.getValues('cluar', _val.map()).getBoolean("uglifyjs") == true) {
            const osUglifyJS = _os.init()
            osUglifyJS.directory(_app.folder(Cluar.base()))
            const osUglifyJSResult = osUglifyJS.command(`uglifyjs -o cluarData.js -- cluarData.js`)
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
        document.appendChild(tagURLSet)
        xml.save(document, _app.file(`${Cluar.base()}/sitemap.xml`))
        if (!_app.file(`${Cluar.base()}/robots.txt`).exists()) {
            const output = _app.file(`${Cluar.base()}/robots.txt`).output()
                .println('User-agent: *')
                .println('Allow: /')
                .println(`Sitemap: ${origin}/sitemap.xml`)
                .close()
        }
    }

    static publishImage(section, fileName) {
        if (fileName == "") {
            return;
        }
        const folder = _app.folder(`${Cluar.base()}/images/${section}`)
        if (!folder.exists()) {
            folder.mkdir()
        }
        const websiteFile = _app.file(`${folder.path()}/${fileName}`)
        const databaseFile = _storage.database(section, "image", fileName).file()
        if (!websiteFile.exists()
             || databaseFile.available() != websiteFile.available()
             || databaseFile.lastModified() > websiteFile.lastModified()) {
            _storage.database(section, "image", fileName)
                .file()
                .copy(`${folder.path()}/${fileName}`, true)
        }
    }

    static actionDataItemProcessWithAnImage() {
        const section = _dataItem.getTable()
        
        const folder = _app.folder(`${Cluar.base()}/images/${section}`)
        
        if (!folder.exists()) {
            folder.mkdir()
        }

        if (_dataItem.getValues().has("image:old")) {
            _app.file(`${folder.path()}/${_dataItem.getValues().getString("image:old")}`).delete()
        }

        if (_dataItem.getValues().has("image:new")) {
            _storage.database(section, "image", _dataItem.getValues().getString("image:new"))
                .file()
                .copy(`${folder.path()}/${_dataItem.getValues().getString("image:new")}`)
        }
    }

    static actions(section, id) {
        const dbActions = _db.query(`
        SELECT
            action.title,
            action.content,
            action.indication,
            action.link
        FROM action
            INNER JOIN ${section}_action ON ${section}_action.action_id = action.id
        WHERE
            action.active = true
            AND ${section}_action.active = TRUE
            AND ${section}_action.${section}_id = ${id}
        ORDER BY ${section}_action.sorter
        `)
        const actions = _val.list()
        for (const dbAction of dbActions) {
            actions.add(
                _val.map()
                    .set("title", dbAction.getString("title"))
                    .set("content", dbAction.getString("content"))
                    .set("indication", dbAction.getString("indication"))
                    .set("link", dbAction.getString("link"))
                    .set("sorter", dbAction.getInt("sorter"))
            )
        }
        return actions
    }
}
