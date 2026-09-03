![logocluar](https://raw.githubusercontent.com/netuno-org/cluar/main/docs/logo.svg)

# CLUAR CMS 

Uma solução pronta a usar para gestão de conteúdos e websites multilíngues usando [Netuno](https://www.netuno.org/), [ReactJS](https://reactjs.org/) e [Ant Design](https://ant.design/).

## Documentação :books:

A documentação completa do CLUAR — instalação, configuração, páginas, componentes, ações, configurações, dicionários, templates e permissões — está disponível na [Academia do Netuno](https://doc.netuno.org/pt/docs/academy/cluar/overview).

A configuração deste repositório está documentada na [referência completa de configuração](docs/configuration-reference-pt_PT.md).

## Instalação :cd:

Instala estes requisitos:
1. [Netuno](https://doc.netuno.org/pt/docs/get-started/installation)
2. [Bun](https://bun.sh/docs/installation)

Depois clona este projeto dentro de:

- :open_file_folder: `[diretório raiz do Netuno]/apps`

Usando o comando de clone:

```
git clone https://github.com/netuno-org/cluar.git
```

## Configuração :wrench:

> O processo abaixo é orientado para ambientes de desenvolvimento Linux.

1. Renomeia a pasta do projeto (o nome da app) usando apenas letras minúsculas, números e underscore.

2. Copia o ficheiro de configuração de amostra da app, executando (no diretório raiz da app):
  - `cp config/sample.json config/_development.json` (para um ambiente de desenvolvimento)
  - `cp config/sample.json config/_production.json` (para um ambiente de produção)
  - Altera a propriedade `name` na raiz do JSON para o nome da app escolhido.
  - Faz os restantes ajustes de acordo com o teu ambiente.

3. Vais precisar de configurar uma ligação a uma base de dados do tipo PostgreSQL para esta app funcionar corretamente, [aprende a fazê-lo aqui](https://doc.netuno.org/pt/docs/academy/server/database/psql/).

4. Edita o ficheiro de configuração criado no passo anterior e localiza `"db": { "default": ... }`, depois substitui os dados de ligação pelos da tua base de dados.

5. Muda o segredo de autenticação JWT, localizando `"auth": { "jwt": { "secret": ... } }` — garante que este segredo tem 32 caracteres.

6. Se quiseres, ativa o [Altcha](https://altcha.org/) (uma alternativa ao reCAPTCHA que preserva a privacidade), definindo `"auth": { "altcha": { "enabled": true } }` para a validação no servidor e `"settings": { "cluar": { "website": { "auth": { "altcha": true } } } }` para o widget aparecer no website.

7. Dentro de `"settings": { "cluar": ... }` ajusta o URL do Website, o URL da API de Serviços, e o resto conforme necessário.

## Website com Bun :art:

Dentro da pasta website:

```
cd website
```

Executa o comando de instalação do Bun:

```
bun install
```

É necessário permitir a execução de scripts não confiáveis do ESBUILD, então executa:

```
bun pm trust --all
```

Se precisares de reiniciar a instalação do website, remove esta pasta e estes ficheiros:

```
rm -rf node_modules
bun install
bun pm trust --all
```

Agora podes iniciar o website com o comando clássico:

```bun run dev```

> Por padrão, o website corre com Bun.

## Resolução de problemas :hammer_and_wrench:

### Erro de versão do GLIBC ao correr `bun run dev`

Se aparecer um erro como este ao iniciar o website:

```
Error: Cannot find module @rollup/rollup-linux-x64-gnu. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory.
...
[cause]: Error: /lib/x86_64-linux-gnu/libc.so.6: version `GLIBC_2.32' not found (required by .../node_modules/@rollup/rollup-linux-x64-gnu/rollup.linux-x64-gnu.node)
code: 'ERR_DLOPEN_FAILED'
```

Não se trata do bug de dependências opcionais do npm mencionado na mensagem, mas sim de uma **incompatibilidade de versão do GLIBC**: o binário nativo do Rollup foi compilado exigindo o `GLIBC_2.32` ou mais recente, e distribuições Linux mais antigas (por exemplo, Ubuntu 20.04, que traz o glibc 2.31) não o têm disponível.

O `package.json` do website já força o Rollup a usar a versão WASM em vez da nativa. Confirma que este campo `overrides` continua presente:

```json
"overrides": {
  "rollup": "npm:@rollup/wasm-node"
}
```

De seguida, reinstala as dependências:

```
rm -rf node_modules bun.lock bun.lockb
bun install
bun pm trust --all
bun run dev
```

## Execução :rocket:

No diretório raiz do Netuno, executa:

`./netuno server app=<nome-da-app>`

> Se o nome da aplicação não foi alterado, utilize `cluar` como nome da app.

Substitui `<nome-da-app>` pelo nome da pasta/configuração escolhido acima. O comando inicia o back-end e, quando o comando do website está ativado na configuração da app, o servidor front-end.

> A primeira execução pode demorar mais tempo, devido à instalação das dependências do front-end.

Por padrão, o backoffice do Netuno fica disponível em:
  - [http://localhost:9000/](http://localhost:9000/)

O OpenAPI fica em:
  - [http://localhost:9000/services/_openapi](http://localhost:9000/services/_openapi)

Para iniciar o website:

```
cd website
bun run dev
```

Por padrão, o website fica disponível em:
  - [http://localhost:3000/](http://localhost:3000/)

Podes fazer o website arrancar automaticamente junto com o servidor Netuno, ativando o comando em `config/_development.json`:

```
   "commands": [
      ...
      {
         "path": "website",
         ...
         "enabled": true
      }
   ]
```
