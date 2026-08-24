import { _app, _val, _os, _log, _xml } from "@netuno/server-types";
import base from "#core/cluar/base.js";
import custom from "#core/cluar/custom/main.js";
import page from "#core/cluar/publishPage.js";

export default {
  build: (settings) => {
    settings = settings || {}

    const folder = _app.folder(`${base.basePath()}/cluar`)
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

    const languages = base.languages();
    data.set("languages", languages)

    /*
     *
     *  CONFIGURATION
     *
     */

    const configuration = base.configuration()
    data.set("configuration", configuration)

    /*
     *  Título (index.html) + root.css (cores). Ambos ficheiros "de raiz",
     *  nunca tocam em páginas já publicadas - ver comentário completo em
     *  cluarBase.applyConfigurationToIndexHtml.
     */
    base.applyConfigurationToIndexHtml(configuration)

    /*
     *
     *  DICTIONARY
     *
     */

    data.set("dictionary", base.dictionary())

    /*
     *
     *  PAGES
     *
     *  publishAll republica (clona o index.html atual para) TODAS as
     *  páginas já publicadas - é uma operação O(número de páginas), por
     *  isso só corre quando pedido explicitamente (settings.publishAll),
     *  nunca como efeito colateral automático de gravar uma configuração,
     *  conteúdo, etc. Ver server/services/admin/cluar/sync.js.
     */

    const pages = base.pages({ publishFn: settings.publishAll === true ? page.publishPage : null })
    data.set("pages", pages)

    /*
     *
     *  ACTIONS
     *
     */

    data.set("actions", base.actions())

    custom.build(settings, data)

    /*
     *
     *  MAIN FILE
     *
     */

    const file = _app.file(`${base.basePath()}/cluar/data.js`)
    file.output().print(`window.cluar = ${data.toJSON(4)};`).close()

    if (_app.settings.getValues('cluar', _val.map()).getBoolean("uglifyjs") == true) {
      const osUglifyJS = _os.init()
      osUglifyJS.directory(_app.folder(base.basePath()))
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
    attrMobile.setValue("http://www.sitemaps.org/schemas/sitemap/1.0")
    tagURLSet.setAttributeNode(attrMobile)
    const attrImage = document.createAttribute("xmlns:image")
    attrImage.setValue("http://www.google.com/schemas/sitemap-image/1.1")
    tagURLSet.setAttributeNode(attrImage)
    const attrVideo = document.createAttribute("xmlns:video")
    attrVideo.setValue("http://www.google.com/schemas/sitemap-video/2.1")
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
        tagLoc.appendChild(document.createTextNode(origin + "/" + language.getString("locale") + page.getString("link")))
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
    custom.siteMap(origin, document, tagURLSet)
    document.appendChild(tagURLSet)
    xml.save(document, _app.file(`${base.basePath()}/sitemap.xml`))
    if (!_app.file(`${base.basePath()}/robots.txt`).exists()) {
      const output = _app.file(`${base.basePath()}/robots.txt`).output()
        .println('User-agent: *')
        .println('Allow: /')
        .println(`Sitemap: ${origin}/sitemap.xml`)
        .close()
    }
  }
};
