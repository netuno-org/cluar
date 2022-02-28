
# Idioma (`language`)

[:arrow_backward: Principal](../README-pt_PT.md)

Na interface de backoffice os idiomas são geridos no formulário `Idioma`.

> O campo Localização (`locale`) é o valor que distingue o idioma no link das páginas, também é utilizado em código, como para realizar a troca de idioma. Os campos de Descrição (`description`) e de Código internacional (`code`), servem para indicar mais detalhes informativos. O idioma assinalado como Padrão (`default`) será o idioma preferencial do website.

O menu de seleção do idioma é processado no Header do website em:

- `website/src/base/Header`

> No componente ReactJS (`index.js`) procure por `menuLanguages` e no CSS/LESS (`index.less`) é customizado pela class `menu-languages`.

O componente utilizado para construir a seleção do idiomas é o [Menu do Ant.Design](https://ant.design/components/menu/).

## Programaticamente

Na classe JavaScript de funções úteis do CLUAR CMS:

- `website/src/common/Cluar.js`

É posssível trabalhar com o idioma, como por exemplo:

- `Cluar.defaultLanguage()` - Obter o idioma padrão.
- `Cluar.currentLanguage()` - Obter o idioma ativo no momento atual.
- `Cluar.changeLanguage(codigoOuLocalizacao)` - Realizar a ativação de outro idioma programaticamente.
- `Cluar.languages()` - Obtém a lista de todos os idiomas.

[:arrow_backward: Principal](../README-pt_PT.md)
