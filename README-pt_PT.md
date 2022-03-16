![Logo](https://raw.githubusercontent.com/netuno-org/cluar/main/docs/logo.svg)

# CLUAR CMS

Uma solução pronta para gestão de conteúdos e websites multilíngue utilizando [Netuno](https://www.netuno.org/), [ReactJS](https://reactjs.org/) e [Ant Design](https://ant.design/).

## Requisito

### Plataforma Netuno

[Siga os passos aqui](https://doc.netuno.org/docs/pt-PT/installation/)

## Documentação

[Documentação Geral do CLUAR CMS](docs/README-pt_PT.md)

## Instalação Automática da Aplicação

```
./netuno app github=netuno-org/cluar
```

### Execução

Inicie o servidor Netuno:

```
./netuno server app=cluar
```

> Pode demorar porque é a primeira vez e a instalação do NPM será executada nas pastas `ui` e` website` dentro da pasta raiz do aplicativo.

:warning: Se tiver o error:
 
```
 npm ERR! code ERESOLVE
 npm ERR! ERESOLVE unable to resolve dependency tree
```

Então execute o comando abaixo dentro da pasta `website`:

`npm install --force`

:white_check_mark: Não é obrigatório, mas é recomendado renomar a pasta da aplicação `(Netuno Root directory)/apps/cluar/` para o nome desejado, e não esqueça do parâmetro `name` nas configurações:

`config/_development.json`

`config/_production.json`

> Lembre-se de iniciar o servidor Netuno com seu novo nome de aplicativo.

## Processo Manual

### Clone e Instalação

Crie uma nova app com o Netuno denominada `cluar` executando (no diretório raíz do Netuno) 

`./netuno app name=cluar`

e selecionando as configurações desejadas (tipo de base de dados, nome da base de dados e idioma da aplicação).

Depois clone este projeto para o diretório `(Netuno Root directory)/apps/cluar/`.

Depois instale as dependências NPM excutando

`npm install --force` 

no diretório `cluar/website/`.

### Configuração

Copie o ficheiro de exemplo de configuração executando o seguinte

`cp config/sample.json config/_development.json` (certifique-se do parâmetro `name`)

e modifique de acordo com a configuração do seu ambiente local.

### Execução

No diretório raíz do Netuno execute

`./netuno server app=cluar`

que irá iniciar o servidor de backend e depois execute no diretório `(cluar app directory)/website/` o seguinte

`npm run start`

para iniciar o servidor de frontend.
