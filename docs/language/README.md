
# Language (`language`)

[:arrow_backward: Main](../README.md)

In the back office interface languages ​​are managed in the form `Language`.

> The Locale field (`locale`) is the value that distinguishes the language in the link of the pages, it is also used in code, such as to change the language. The Description (`description`) and International code (`code`) fields are used to indicate more informational details. The language marked as Default (`default`) will be the preferred language of the website.

The language selection menu is processed in the website header at:

- `website/src/base/Header`

> In the ReactJS component (`index.js`) look for `menuLanguages` and in the CSS/LESS (`index.less`) it is customized by the `menu-languages` class.

The component used to build the language selection is the [Ant.Design Menu](https://ant.design/components/menu/).

## Programmatically

In the CLUAR CMS useful functions JavaScript class:

- `website/src/common/Cluar.js`

It is possible to work with the language, for example:

- `Cluar.defaultLanguage()` - Get the default language.
- `Cluar.currentLanguage()` - Get the currently active language.
- `Cluar.changeLanguage(codigoOuLocalizacao)` - Perform activation of another language programmatically.
- `Cluar.languages()` - Gets the list of all languages.

[:arrow_backward: Main](../README.md)
