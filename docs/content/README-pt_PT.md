
# Conteúdo (`content`)

[:arrow_backward: Principal](../README-pt_PT.md)

No menu do backoffice em `Conteúdo` é gerido os conteúdos das páginas do website.

O conteúdo pode conter Título, Descrição, Imagem e Ordem (ordenação).

## ReactJS & CSS/LESS

O componente ReactJS que gere todos os Conteúdos no website fica em:

- `website/src/components/Content`

O componente recebe diversas propriedades como título (`title`), conteúdo (`content`), imagem (`image`), entre outras.

> Antes de realizar a customização analise as propriedades e o código CSS/LESS associado ao componente.

### Tipo (`type`)

Os conteúdos devem conter um tipo associado.

O tipo pode ser customizado no formulário `Conteúdo > Tipo`, onde o campo código é o valor que é utilizado pelo componente ReactJS na propriedade `type`.

Então a propriedade `type` recebida no componente ReactJS `website/src/components/Content` define o tipo de conteúdo que será procesado.

A propriedade `type` pode ser utilizada em condições para customizar a estrutura HTML que será processada na renderização do componente.
 
O `type` também deve adicionado nas propriedades `className` de tags HTML geradas pelo componente, para manter o padrão e organização de nomes, e ainda facilita custumizar a sua aparência no código CSS/LESS.

[:arrow_backward: Principal](../README-pt_PT.md)
