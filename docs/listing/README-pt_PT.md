
# Listagem (`listing`)

[:arrow_backward: Principal](../README-pt_PT.md)

No menu do backoffice em `Listagem` é gerida as listas de itens, quando precisamos listar uma série de dados, como produtos, serviços, referências, notícias, e muito mais.

Por isso que dentro do menu do backoffice `Listagem` tem o `Item`, que é onde associamos os itens às respectivas listagens.

A listagem pode conter Título, Conteúdo, Imagem e Ordem (ordenação).

Cada listagem deve conter itens relacionionados em `Listagem > Item`

## ReactJS & CSS/LESS

O componente ReactJS que gere todas as Listagens (`listing`) no website fica em:

- `website/src/components/Listing`

O componente recebe diversas propriedades como título (`title`), conteúdo (`content`), imagem (`image`), entre outras, além do array que contém os subitens relacionados (`items`).

> Antes de realizar a customização analise as propriedades e o código CSS/LESS associado ao componente.

### Tipo (`type`)

A listagem (`listing`) devem conter um tipo associado.

O tipo pode ser customizado no formulário `Listagem > Tipo`, onde o campo código é o valor que é utilizado pelo componente ReactJS na propriedade `type`.

Então a propriedade `type` recebida no componente ReactJS `website/src/components/Listing` define o tipo de listagem que será procesada.

> O `type` também é passado para os `items`, assim nos itens da listagem também é possível realizar a customizações de acordo com o tipo da listagem.

A propriedade `type` pode ser utilizada em condições para customizar a estrutura HTML que será processada na renderização do componente.
 
O `type` também deve adicionado nas propriedades `className` de tags HTML geradas pelo componente, para manter o padrão e organização de nomes, e ainda facilita custumizar a sua aparência no código CSS/LESS.

### Item

No backoffice os items são geridos em `Listagem > Item`, cada item contém a listagem ao qual pertence, título (`title`), conteúdo (`content`), imagem (`image`), ordem, URL (`link`) e o tipo (`type`) que é o tipo de listagem que é processada.

O componente ReactJS que gere todos os Itens (`Listing/Item`) no website fica em:

- `website/src/components/Listing/Item`

A propriedade `type` pode ser utilizada em condições para customizar a estrutura HTML que será processada na renderização do componente.
 
O `type` também deve adicionado nas propriedades `className` de tags HTML geradas pelo componente, para manter o padrão e organização de nomes, e ainda facilita custumizar a sua aparência no código CSS/LESS.

[:arrow_backward: Principal](../README-pt_PT.md)

