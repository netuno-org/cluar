![logocluar](https://raw.githubusercontent.com/netuno-org/cluar/main/docs/logo.svg)

# CLUAR CMS 
Uma solução pronta a usar para gestão de conteúdos e sites multilingues usando [Netuno](https://www.netuno.org/), [ReactJS](https://reactjs.org/) e [Ant Design](https://ant.design/).

## Instalação :cd:

**Netuno**

[Siga os passos aqui](https://doc.netuno.org/docs/get-started/installation)

**Bun**

[Siga os passos aqui](https://bun.sh/docs/installation)

**Cluar App**

Clone este projeto para `(Netuno Root diretory)/apps/cluar/`.

## Documentação

[Documentação Geral do CLUAR CMS](docs/README.md)

## Configuração :wrench:

> O seguinte processo é orientado para ambientes de desenvolvimento Linux.

1. Copie o ficheiro de configuração de amostra da aplicação executando (no diretório raiz da aplicação):
    - `cp config/sample.json config/_development.json` (para um ambiente de desenvolvimento)
    - `cp config/sample.json config/_production.json` (para um ambiente de produção)
    - e ajuste o ficheiro `_development.json` e/ou `_production.json` de acordo com o seu ambiente.
  
2. Você precisará configurar uma conexão do tipo banco de dados PostgreSQL para que este aplicativo funcione corretamente, [aprenda como fazer isso aqui] (https://doc.netuno.org/pt/docs/academy/server/database/psql/).

3. Localizar e substituir a palavra `S3cR3t` por um código secreto, o mais aleatório possível, pois é este que garante a segurança das credenciais dos utilizadores. Por exemplo: `#J&Az+7(8d+k/9q]` . [Ferramenta recomendada de geração de código seguro](https://www.random.org/passwords/).

### Configuração do JWT:
4. Certifique-se de que os seguintes parâmetros `_development.json` correspondem ao exemplo:

```
"commands": [
        {
            "path": "ui",
            "command": "npm run watch",
            "install": "npm install --force",
            "enabled": true
        },
        {
            "path": "website",
            "command": "npm run dev",
            "install": "npm install --force",
            "enabled": true
        }
    ]
```

```
"cluar": {
            "website": {
                "url": "http://localhost:3000",
                "name": "Website Name",
                "analytics": null,
                "mapbox": {
                    "dark": false,
                    "accessToken": null
                },
                "services": {
                    "api": "http://localhost:9000/services/"
                },
                "auth": {"providers": {
                    "discord": false,
                    "facebook": false,
                    "github": false,
                    "google": true
                }}
            },
            "uglifyjs": false
        },
```

```
"config": {
        "auth": {"providers": {
            "discord": false,
            "facebook": false,
            "github": false,
            "google": true
        }},
        "mapbox": {"dark": false},
        "name": "Website Name",
        "services": {"api": "http://localhost:9000/services/"},
        "url": "http://localhost:3000"
    }
```

  - adicionar o parâmetro `auth` após o fecho do parâmetro `settings`:
```
"auth": {
        "jwt": {
          "enabled": true,
          "secret": "ThisSecretMustContains32Chars!!!",
          "expires": {
            "access": 1440,
            "refresh": 1440
          }
        }
    }
```
> Na chave "jwt", preencha de acordo com a sua preferência. Recomenda-se a utilização de um gerador de palavras-passe aleatórias: [Ferramenta recomendada de geração de código seguro](https://www.random.org/passwords/).

5. no diretório `website/` executar o comando `npm install --force`.

6. Você também precisará configurar o arquivo de configuração de exemplo do site localizado em `website/src/config/`:
    - Altere as configurações dentro de `_development_config.json` e `_production_config.json` para os ambientes de desenvolvimento e produção, respetivamente.
      

## Execução :rocket:

No diretório raiz do Netuno, execute

`./netuno server app=cluar`

e deverá iniciar tanto o servidor back-end como o front-end.

> A primeira execução pode demorar um pouco devido à instalação das dependências do front-end.

Por padrão, o back office Netuno estará disponível em:
  - [http://localhost:9000/](http://localhost:9000/)

O OpenAPI estará em:
  - [http://localhost:9000/services/_openapi](http://localhost:9000/services/_openapi)

E o front-end (site restrito) iniciará em:
  - [http://localhost:3000/](http://localhost:3000/)
