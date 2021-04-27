# Netuno CLUAR

Uma solução pronta para websites multilíngue utilizando [Netuno](https://www.netuno.org/), [ReactJS](https://reactjs.org/) e [Ant Design](https://ant.design/).

## Instalação

#### Netuno

[Follow the steps here](https://doc.netuno.org/docs/en/installation/)

#### CLUAR

Crie uma nova app com o Netuno denominada `cluar` executando (no diretório raíz do Netuno) 

`./netuno app name=cluar`

e selecionando as configurações desejadas (tipo de base de dados, nome da base de dados e idioma da aplicação).

Depois clone este projeto para o diretório `(Netuno Root directory)/apps/cluar/`.

Depois instale as dependências NPM excutando

`npm install` 

no diretório `cluar/website/`.

## Configuração

Copie o ficheiro de amostra de configuração de serviços executando o seguinte

`cp website/src/config/config-dev.json website/src/config/config.json` 

e modifique de acordo com a configuração do seu ambiente local.

## Execução

No diretório raíz do Netuno execute

`./netuno server app=cluar`

que irá iniciar o servidor de backend e depois execute no diretório `(cluar app directory)/website/` o seguinte

`npm run start`

para iniciar o servidor de frontend.