
# Estandarte (`banner`)

[:arrow_backward: Principal](../README-pt_PT.md)

No menu do backoffice em `Estandarte` é gerido os grandes destaques das páginas do website, também conhecido como __Banners__, são aquelas boas imagens que ocupam toda a área da janela com um título por cima bem destacado e as vezes com algum texto introdutório, há outros mais curtos e de muitas outras formas.

O estandarte pode conter Título, Descrição, Imagem e Ordem (ordenação).

## ReactJS & CSS/LESS

O componente ReactJS que gere todos os Estandartes (`banner`) no website fica em:

- `website/src/components/Banner`

O componente recebe diversas propriedades como título (`title`), conteúdo (`content`), imagem (`image`), entre outras.

> Antes de realizar a customização analise as propriedades e o código CSS/LESS associado ao componente.

### Tipo (`type`)

Os estandartes (`banner`) devem conter um tipo associado.

O tipo pode ser customizado no formulário `Estandarte > Tipo`, onde o campo código é o valor que é utilizado pelo componente ReactJS na propriedade `type`.

Então a propriedade `type` recebida no componente ReactJS `website/src/components/Banner` define o tipo de estandarte que será procesado.

A propriedade `type` pode ser utilizada em condições para customizar a estrutura HTML que será processada na renderização do componente.
 
O `type` também deve adicionado nas propriedades `className` de tags HTML geradas pelo componente, para manter o padrão e organização de nomes, e ainda facilita custumizar a sua aparência no código CSS/LESS.

### Posição (`position_x` & `position_y`)

A posição X e Y servem para ajustar o foco da imagem de background nas diversas resoluções, o valor habitual é em porcentagem.

> Permite controlar uma parte da imagem que seja necessário estar sempre visível.

Por exemplo se ambos os campostos conter o valor `50%`, então quer dizer que o foco será no centro da imagem, ou seja em qualquer resolução a parte da imagem que estará sempre visível será o seu centro.

[:arrow_backward: Principal](../README-pt_PT.md)
