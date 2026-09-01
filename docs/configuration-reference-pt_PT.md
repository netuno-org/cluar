# Referência de configuração

Esta referência abrange todas as folhas e contentores intencionalmente vazios de `config/sample.json`. Copie o exemplo para o ficheiro do ambiente e substitua credenciais, URLs e segredos. Um caminho com `[]` aplica-se a cada elemento do array.

## Aplicação e setup

| Caminho | Exemplo | Finalidade |
| --- | --- | --- |
| `name` | `cluar` | Nome da aplicação Netuno; deve corresponder à pasta da aplicação. |
| `language` | `en_GB` | Código do idioma predefinido. |
| `locale` | `en_GB` | Locale regional predefinido. |
| `setup.enabled` | `true` | Ativa o setup da aplicação. |
| `setup.schema.execution` | `true` | Executa os scripts de esquema. |
| `setup.schema.auto_create` | `true` | Cria automaticamente estruturas de esquema em falta. |
| `setup.scripts.execution` | `true` | Executa os scripts de dados/setup. |
| `cron.jobs` | `[]` | Definições de tarefas agendadas. O exemplo não regista nenhuma; os objetos Netuno usam nome, expressão Quartz e URL do serviço. |

## Website CLUAR

`server/core/cluar/build.js` copia `settings.cluar.website` para `window.cluar.config`, gerado em `cluar/data.js`.

| Caminho | Exemplo | Finalidade |
| --- | --- | --- |
| `settings.cluar.website.url` | `http://localhost:3000` | Origem pública usada no sitemap e nos URLs Open Graph. |
| `settings.cluar.website.name` | `Website Name` | Nome do site usado nos metadados gerados. |
| `settings.cluar.website.analytics` | `null` | ID do Google Analytics; um valor não vazio inicializa `react-ga`. |
| `settings.cluar.website.mapbox.dark` | `false` | Seleciona o estilo Mapbox escuro no componente de mapa. |
| `settings.cluar.website.mapbox.accessToken` | `null` | Token Mapbox usado pelo componente de mapa. |
| `settings.cluar.website.services.api` | `http://localhost:9000/services/` | URL base do cliente de serviços do website. |
| `settings.cluar.website.auth.altcha` | `false` | Mostra ALTCHA no login/registo. Ative também `auth.altcha.enabled` para validação no servidor. |
| `settings.cluar.website.auth.providers.discord` | `false` | Mostra Discord quando o fornecedor Netuno correspondente está configurado. |
| `settings.cluar.website.auth.providers.facebook` | `false` | Mostra Facebook quando configurado. |
| `settings.cluar.website.auth.providers.github` | `false` | Mostra GitHub quando configurado. |
| `settings.cluar.website.auth.providers.google` | `false` | Mostra Google quando configurado. |
| `settings.cluar.uglifyjs` | `false` | Executa o comando externo `uglifyjs` sobre `cluar/data.js`; o executável tem de existir quando ativo. |
| `settings.public` | `{}` | Contentor vazio de configuração pública; o CLUAR não o lê diretamente. |

O código contém callbacks do fornecedor Microsoft através do Netuno, mas `sample.json` não disponibiliza uma flag `microsoft` e `Cluar.authProviders()` devolve apenas o objeto configurado. Acrescente-a apenas juntamente com o suporte correspondente na interface/fornecedor.

## reCAPTCHA e ligação remota

| Caminho | Exemplo | Finalidade |
| --- | --- | --- |
| `settings.recaptcha.url` | URL de verificação Google | Endpoint de verificação lido pelo serviço de contacto (`server/services/contact/post.js`). |
| `settings.recaptcha.secret_key` | vazio | Segredo lido pelo serviço de contacto para verificar o token. Não submeta um valor real. |
| `remote.recaptcha.json` | `true` | Configura a ligação remota `recaptcha` (usada pelo serviço de contacto) para JSON. |

O formulário de contacto usa reCAPTCHA: `server/services/contact/post.js` lê `recaptchaValue` do pedido e verifica-o através da ligação remota `recaptcha` antes de guardar a mensagem. O registo (`server/services/reserved-area/people/post.js`) usa ALTCHA.

## CORS

| Caminho | Exemplo | Finalidade |
| --- | --- | --- |
| `cors[].origins[]` | `*` | Padrões de origem permitidos. Restrinja o wildcard em produção. |
| `cors[].enabled` | `true` | Ativa a regra CORS. |

## SMTP

| Caminho | Exemplo | Finalidade |
| --- | --- | --- |
| `smtp.default.enabled` | `true` | Ativa a ligação SMTP predefinida. |
| `smtp.default.host` | `smtp.gmail.com` | Servidor SMTP. |
| `smtp.default.port` | `465` | Porta SMTP. |
| `smtp.default.ssl` | `true` | Ativa SSL. |
| `smtp.default.from` | `email@gmail.com` | Remetente predefinido. |
| `smtp.default.username` | `username` | Nome de utilizador SMTP. |
| `smtp.default.password` | apenas exemplo | Palavra-passe SMTP; substitua-a e não submeta o valor real. |

O formulário de contacto envia um alerta e a recuperação envia o template através desta ligação.

## Firebase

| Caminho | Exemplo | Finalidade |
| --- | --- | --- |
| `firebase.app_name` | vazio | Identificador da aplicação Firebase. |
| `firebase.database_url` | vazio | URL da Realtime Database. |
| `firebase.key_file` | vazio | Caminho do ficheiro da conta de serviço. |
| `firebase.listener_secret` | vazio | Segredo para autenticar callbacks de listeners. |

O `_init.js` atual não regista listeners Firebase; são configurações de extensão até ser acrescentado um.

## Comandos de desenvolvimento

| Caminho | Valores de exemplo | Finalidade |
| --- | --- | --- |
| `commands[].path` | `ui`, `website` | Diretório de trabalho relativo à raiz. |
| `commands[].command` | `bun run watch`, `bun run dev` | Processo iniciado pelo Netuno. |
| `commands[].install` | `bun install` | Instalação de dependências. |
| `commands[].enabled` | `false` | Ativa o arranque automático. Mantenha watchers desativados em produção. |

Os scripts do website são `dev`, `build`, `lint` e `preview`. Os da interface de backoffice são `dev`, `build`, `watch`, `lint` e `preview`.

## Base de dados

| Caminho | Exemplo | Finalidade |
| --- | --- | --- |
| `db.default.engine` | `pg` | Motor; o setup do CLUAR destina-se ao PostgreSQL. |
| `db.default.host` | `localhost` | Servidor. |
| `db.default.port` | `5432` | Porta. |
| `db.default.name` | `cluar` | Nome da base de dados. |
| `db.default.username` | `cluar` | Nome de utilizador. |
| `db.default.password` | apenas exemplo | Palavra-passe; substitua-a e não submeta o valor real. |

## Autenticação

| Caminho | Exemplo | Finalidade |
| --- | --- | --- |
| `auth.altcha.enabled` | `false` | Ativa as validações ALTCHA no servidor. Ative esta flag e a do website em conjunto. |
| `auth.jwt.enabled` | `true` | Ativa JWT. |
| `auth.jwt.secret` | apenas exemplo | Segredo de assinatura JWT; use um segredo aleatório com pelo menos 32 caracteres. |
| `auth.jwt.expires.access` | `1440` | Duração do token de acesso, em minutos. |
| `auth.jwt.expires.refresh` | `1440` | Duração do token de renovação, em minutos. |

O website também chama as rotas Netuno `/_auth`, `/_auth_provider/*` e `/_altcha`; não são implementadas em `server/services` neste repositório.

Para a superfície local completa de serviços e extensões, consulte `server/services` e `server/core` neste repositório.
