# Estandarte (`banner`)

[:arrow_backward: Principal](../README-pt_PT.md)

As secções de estandarte são geridas no editor de páginas. São os principais destaques visuais das páginas do website e podem conter título, conteúdo, imagem, ordem de apresentação, ações e posições de foco da imagem.

## ReactJS e CSS/LESS

O componente que apresenta as secções de estandarte fica em:

- `website/src/components/Banner`

`website/src/components/Banner/index.jsx` encaminha os tipos incluídos `Default`, `Secondary` e `DefaultSubBanner` para as respetivas pastas de componentes; um `type` desconhecido utiliza `Default`. Cada componente de tipo define os valores de `className` usados pelos seus próprios estilos LESS.

### Posição (`position_x` e `position_y`)

As posições X e Y ajustam o foco da imagem de fundo nas diferentes resoluções. Os valores seguem a posição de fundo do CSS e são normalmente percentagens.

Por exemplo, `50%` nos dois campos mantém a imagem centrada.

[:arrow_backward: Principal](../README-pt_PT.md)
