# Conteúdo (`content`)

[:arrow_backward: Principal](../README-pt_PT.md)

As secções de conteúdo são geridas no editor de páginas. Podem conter título, conteúdo, imagem, ordem de apresentação, ações e opções de apresentação da imagem.

## ReactJS e CSS/LESS

O componente que apresenta as secções de conteúdo fica em:

- `website/src/components/Content`

`website/src/components/Content/index.jsx` encaminha os valores incluídos `TextContent`, `ImageLeft`, `ImageRight`, `ImageTop`, `ImageBottom` e `ImageContent` para os respetivos componentes; outros valores de `type` utilizam `Default`. Cada componente de tipo define os valores de `className` usados pelos seus próprios estilos LESS.

[:arrow_backward: Principal](../README-pt_PT.md)
