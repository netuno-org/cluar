
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
6. [Ação](https://doc.netuno.org/pt/docs/academy/cluar/actions)
7. [Dicionário](https://doc.netuno.org/pt/docs/academy/cluar/dictionaries)
8. [Configuração](https://doc.netuno.org/pt/docs/academy/cluar/configuration)
9. [Funcionalidade](https://doc.netuno.org/pt/docs/academy/cluar/components/functionality)

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

- `website/src/styles`
  Aqui contém o CSS principal e global, com a gestão das variáveis (`variables`) de configurações de layout e design.

- `website/src/pages`
  Páginas desenvolvidas à medida sem serem processadas pelo motor do CLUAR CMS.
  
- `website/src/App.jsx`
  Definição das rotas de navegação (`react-router`) e da estrutura global do website.

- `website/src/main.jsx`
  É onde a aplicação React arranca e onde os dados base do CLUAR CMS são carregados de `/cluar/data.js`.

- `website/vite.config.js`
  Configuração de desenvolvimento/build do Vite, incluindo a porta de desenvolvimento e o processamento de LESS.

#### Estrutura do Código da Aplicação Netuno

Sobre a estrutura da aplicação do Netuno:

- `config`
  Configuração da aplicação Netuno como base de dados, comandos executados na inicialização, CORS, SMTP, e muito mais.

- `public`
  Ficheiros públicos da aplicação Netuno.
  
- `server`
  Código de servidor da aplicação Netuno.
  
- `server/services`
  Código a programação dos serviços da API REST.

- `storage`
  Ficheiros gerais geridos pelo servidor da aplicação Netuno.

- `ui`
  Programação do dashboard que fica no backoffice da aplicação Netuno.

## Customização de Layout & Design

Para customizar a aparência é utilizado o LESS, então basta editar todos os arquivos `.less` que estão dentro da pasta `website/src` e nos repectivos subdiretórios.

O código LESS central e global fica em `website/src/styles`, dentra desta pasta ficheiro `variables.less` tem as principais parameetrizações de estilos globais.

### Estilização do Ant.Design

Os tokens de tema do Ant Design (cores, tamanho de fonte, raio das bordas, fundos do layout e o algoritmo claro/escuro) são configurados em código através do `ThemedConfigProvider` em `website/src/App.jsx` — procure o objeto `theme={{ token, components, algorithm }}` do `ConfigProvider` (por exemplo `token.colorPrimary`). É este o mecanismo para alterar o aspeto do Ant Design.

O Vite ativa o processamento de LESS em `website/vite.config.js` para as folhas de estilo da própria aplicação. As variáveis globais de design do projeto ficam em `website/src/styles/variables.less`; os estilos específicos dos componentes ficam junto dos respetivos componentes React. O LESS aqui estiliza o CSS próprio da aplicação e não configura o tema do Ant Design.

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
- `website/src/common/Builder.jsx`
  Ficheiros Responsáveis por construir a interface.

## Rotas com React Router

- `website/src/App.jsx`
  Ficheiro responsável por definir as rotas.

## Produção

Siga estas instruções para publicar o seu website feito em CLUAR:

- [NGINX](nginx/README-pt_PT.md)
