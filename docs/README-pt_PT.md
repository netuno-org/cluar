
# Documentação

O CLUAR CMS facilita a criação de websites utilizando ReactJS mas com a manutenção dos conteúdos, navegação, páginas, idiomas, configurações e muito mais, através de um backoffice fornecido pela plataforma Netuno.

Para quem está começando a aprender sobre ReactJS & CSS vai conseguir criar um website moderno e customizado de uma maneira muito prática e intuitiva.

Para quem já domina ReactJS & CSS vai conseguir reduzir muito o tempo de implementação de websites dinâmico com a gestão dos conteúdos, assim poderá focar mais no design e em customizações avançadas.

## Visão Geral 

Estes são os principais mecanismos que o CLUAR CMS oferece por padrão:

1. [Página](page/README-pt_PT.md)
2. [Idioma](language/README-pt_PT.md)
3. [Conteúdo](content/README-pt_PT.md)
4. [Estandarte](banner/README-pt_PT.md)
5. [Listagem](listing/README-pt_PT.md)
6. [Ação](action/README-pt_PT.md)
7. [Dicionário](dictionary/README-pt_PT.md)
8. [Configuração](configuration/README-pt_PT.md)
9. [Funcionalidade](functionality/README-pt_PT.md)

#### Estrutura do Código do Website

O código está organizado da seguinte forma:

- `website/src/base`
  Contém os componentes de cabeçalho (`header` e `menu`) e o rodapé (`footer`), e ainda o alerta de privacidade de cookies.

- `website/src/common`
  Código essencial e utíl de modo geral, e ainda o motor de processamento das páginas (`Builder`)

- `website/src/components`
  Componentes para ser utilizados para construir os conteúdos das páginas.

- `website/src/components/functionality`
  Contém os componentes feitos à medida para ser integrados nos conteúdos das páginas.

- `website/src/config`
  Parametrização da configuração essencial utilizada em código.
  
- `website/src/styles`
  Aqui contém o CSS principal e global, com a gestão das variáveis (`variables`) de configurações de layout e design.

- `website/src/pages`
  Páginas desenvolvidas à medida sem serem processadas pelo motor do CLUAR CMS.
  
- `website/src/App.js`
  Definição das rotas de navegação (`react-router-dom`) e tem a estrutura global do website. 

- `website/src/index.js`
  É onde tudo começa, também é onde é carregado o conteúdo base do CLUAR CMS e onde define o endereço da API REST de serviços.

- `website/craco.config.js`
  Customização das variáveis de layout e design do Ant.Design.

#### Estrutura do Código da Aplicação Netuno

Sobre a estrutura da aplicação do Netuno:

- `config`
  Configuração da aplicação Netuno como base de dados, comandos executados na inicialização, CORS, SMTP, e muito mais.

- `dbs`
  Onde fica os ficheiros de base de dados (`H2Database`) e onde pode ser guardado scripts para outros tipos de bases de dados.

- `public`
  Ficheiros públicos da aplicação Netuno.
  
- `server`
  Código de servidor da aplicação Netuno.
  
- `server/sevices`
  Código a programação dos serviços da API REST.

- `storage`
  Ficheiros gerais geridos pelo servidor da aplicação Netuno.

- `ui`
  Programação do dashboard que fica no backoffice da aplicação Netuno.

## Customização de Layout & Design

Para customizar a aparência é utilizado o LESS, então basta editar todos os arquivos `.less` que estão dentro da pasta `website/src` e nos repectivos subdiretórios.

O código LESS central e global fica em `website/src/styles`, dentra desta pasta ficheiro `variables.less` tem as principais parameetrizações de estilos globais.

### Estilização do Ant.Design

A estilização do Ant.Design é feita no ficheiro `website/craco.config.js`, dentro das configurações do `less` é configurar as variáveis do Ant.Design em `modifyVars`, verifique as variáveis do Ant.Design que podem ser redefinidas:

- [themes/default.less](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less)

## Componentes ReactJS

Os componentes principais 

## Cabeçalho (Header) e Menu

- `website/src/base/Header`
  Contem os ficheiros responsáveis pelo header e menu.

## Rodapé (Footer)

- `website/src/base/Footer`
  Contem os ficheiros responsáveis pelo footer.

## Motor

- `website/src/common/Cluar.js`
- `website/src/common/Builder.js`
  Ficheiros Responsáveis por construir a interface.

## Rotas com React Router

- `website/src/app.js`
  Ficheiro responsável por definir as rotas.
