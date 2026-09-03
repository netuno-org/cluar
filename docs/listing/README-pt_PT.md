# Listagem (`listing`)

[:arrow_backward: Principal](../README-pt_PT.md)

As secções de listagem e os respetivos itens são geridos no editor de páginas. Servem para apresentar séries de dados, como produtos, serviços, referências ou notícias. Uma listagem pode conter título, conteúdo, imagem, ordem de apresentação, ações e itens relacionados.

## ReactJS e CSS/LESS

O componente que apresenta as secções de listagem fica em:

- `website/src/components/Listing`

`website/src/components/Listing/index.jsx` implementa atualmente `Default` e também utiliza `Default` para qualquer outro valor de `type`.

### Item

Os itens são editados dentro de uma secção de listagem. Cada item pode conter título (`title`), conteúdo (`content`), imagem (`image`), ordem e URL (`link`); o `type` da listagem é passado aos seus itens.

O componente de item predefinido fica em:

- `website/src/components/Listing/Default/Item`

O componente do item usa o `type` da listagem no seu `className`, permitindo estilos LESS específicos por tipo.

[:arrow_backward: Principal](../README-pt_PT.md)
