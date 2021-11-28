# Netuno CLUAR

Uma solução pronta para gestão de conteúdos e websites multilíngue utilizando [Netuno](https://www.netuno.org/), [ReactJS](https://reactjs.org/) e [Ant Design](https://ant.design/).

## Requisito

### Plataforma Netuno

[Follow the steps here](https://doc.netuno.org/docs/en/installation/)

## Instalação Automática da Aplicação

```
./netuno app github=netuno-org/cluar
```

Renomeie a pasta da aplicação `(Netuno Root directory)/apps/cluar/` para o nome desejado, e não esqueça do parâmetro `name` nas configurações:

`config/_development.json`

`config/_production.json`

## Clone e Instalação Manual

Crie uma nova app com o Netuno denominada `cluar` executando (no diretório raíz do Netuno) 

`./netuno app name=cluar`

e selecionando as configurações desejadas (tipo de base de dados, nome da base de dados e idioma da aplicação).

Depois clone este projeto para o diretório `(Netuno Root directory)/apps/cluar/`.

Depois instale as dependências NPM excutando

`npm install` 

no diretório `cluar/website/`.

## Configuração Manual

Copie o ficheiro de amostra de configuração de serviços executando o seguinte

`cp config/sample.json config/_development.json` (certifique-se do parâmetro `name`)

`cp website/src/config/config-dev.json website/src/config/config.json` 

e modifique de acordo com a configuração do seu ambiente local.

## Execução

No diretório raíz do Netuno execute

`./netuno server app=cluar`

que irá iniciar o servidor de backend e depois execute no diretório `(cluar app directory)/website/` o seguinte

`npm run start`

para iniciar o servidor de frontend.
