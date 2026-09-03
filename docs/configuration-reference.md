# Configuration reference

This reference covers every leaf or intentionally empty container in `config/sample.json`. Copy the sample to the environment-specific file and replace its credentials, URLs, and secrets. A path containing `[]` applies to every array item.

## Application and setup

| Path | Sample | Purpose |
| --- | --- | --- |
| `name` | `cluar` | Netuno application name; keep it aligned with the application folder. |
| `language` | `en_GB` | Default application language code. |
| `locale` | `en_GB` | Default regional locale. |
| `setup.enabled` | `true` | Enables application setup. |
| `setup.schema.execution` | `true` | Runs schema setup scripts. |
| `setup.schema.auto_create` | `true` | Creates missing schema structures automatically. |
| `setup.scripts.execution` | `true` | Runs the data/setup scripts. |
| `cron.jobs` | `[]` | Scheduled-job definitions. The sample registers none; Netuno job objects use a name, Quartz expression, and service URL. |

## CLUAR website

`server/core/cluar/build.js` copies `settings.cluar.website` into the generated `window.cluar.config` object in `cluar/data.js`.

| Path | Sample | Purpose |
| --- | --- | --- |
| `settings.cluar.website.url` | `http://localhost:3000` | Public site origin used for sitemap and Open Graph URLs. |
| `settings.cluar.website.name` | `Website Name` | Website name used in generated page metadata. |
| `settings.cluar.website.analytics` | `null` | Google Analytics tracking ID; a non-empty value initializes `react-ga`. |
| `settings.cluar.website.mapbox.dark` | `false` | Selects the dark Mapbox style for the contact-map component. |
| `settings.cluar.website.mapbox.accessToken` | `null` | Mapbox access token used by the contact-map component. |
| `settings.cluar.website.services.api` | `http://localhost:9000/services/` | Service-client base URL used by the website. |
| `settings.cluar.website.auth.altcha` | `false` | Shows ALTCHA on website login/registration. Also enable `auth.altcha.enabled` so the server validates it. |
| `settings.cluar.website.auth.providers.discord` | `false` | Shows Discord login/registration when the matching Netuno provider is configured. |
| `settings.cluar.website.auth.providers.facebook` | `false` | Shows Facebook login/registration when configured. |
| `settings.cluar.website.auth.providers.github` | `false` | Shows GitHub login/registration when configured. |
| `settings.cluar.website.auth.providers.google` | `false` | Shows Google login/registration when configured. |
| `settings.cluar.uglifyjs` | `false` | Runs the external `uglifyjs` command over generated `cluar/data.js`. The executable must be available when enabled. |
| `settings.public` | `{}` | Empty public-settings extension container; CLUAR does not read it directly. |

The website code has support for Microsoft provider callbacks through Netuno, but `sample.json` does not expose a `microsoft` display flag and `Cluar.authProviders()` returns only the configured object. Add that flag only together with corresponding UI/provider support.

## reCAPTCHA and remote connection

| Path | Sample | Purpose |
| --- | --- | --- |
| `settings.recaptcha.url` | Google's verification URL | Verification endpoint read by the contact service (`server/services/contact/post.js`). |
| `settings.recaptcha.secret_key` | empty | Secret read by the contact service to verify the token. Do not commit a real secret. |
| `remote.recaptcha.json` | `true` | Configures the named `recaptcha` remote connection (used by the contact service) to parse JSON. |

The contact form uses reCAPTCHA: `server/services/contact/post.js` reads `recaptchaValue` from the request and verifies it through the `recaptcha` remote before storing the message. Registration (`server/services/reserved-area/people/post.js`) uses ALTCHA instead.

## CORS

| Path | Sample | Purpose |
| --- | --- | --- |
| `cors[].origins[]` | `*` | Allowed origin patterns. Restrict the wildcard in production. |
| `cors[].enabled` | `true` | Enables the CORS rule. |

## SMTP

| Path | Sample | Purpose |
| --- | --- | --- |
| `smtp.default.enabled` | `true` | Enables the default SMTP connection. |
| `smtp.default.host` | `smtp.gmail.com` | SMTP hostname. |
| `smtp.default.port` | `465` | SMTP port. |
| `smtp.default.ssl` | `true` | Enables SSL. |
| `smtp.default.from` | `email@gmail.com` | Default sender. |
| `smtp.default.username` | `username` | SMTP login. |
| `smtp.default.password` | sample only | SMTP password; replace it and do not commit the real value. |

The contact form sends an alert and password recovery sends the recovery template through this default connection.

## Firebase

| Path | Sample | Purpose |
| --- | --- | --- |
| `firebase.app_name` | empty | Firebase application identifier. |
| `firebase.database_url` | empty | Firebase Realtime Database URL. |
| `firebase.key_file` | empty | Service-account key-file path. |
| `firebase.listener_secret` | empty | Secret used to authenticate Firebase listener callbacks. |

The current `_init.js` does not register a Firebase listener, so these are extension settings until one is added.

## Development commands

| Path | Sample values | Purpose |
| --- | --- | --- |
| `commands[].path` | `ui`, `website` | Working directory relative to the application root. |
| `commands[].command` | `bun run watch`, `bun run dev` | Process started by Netuno. |
| `commands[].install` | `bun install` | Dependency-installation command. |
| `commands[].enabled` | `false` | Enables automatic process startup. Keep development watchers disabled in production. |

The website scripts are `dev`, `build`, `lint`, and `preview`. The backoffice UI scripts are `dev`, `build`, `watch`, `lint`, and `preview`.

## Database

| Path | Sample | Purpose |
| --- | --- | --- |
| `db.default.engine` | `pg` | Database engine; CLUAR's setup targets PostgreSQL. |
| `db.default.host` | `localhost` | Database hostname. |
| `db.default.port` | `5432` | Database port. |
| `db.default.name` | `cluar` | Database name. |
| `db.default.username` | `cluar` | Database username. |
| `db.default.password` | sample only | Database password; replace it and do not commit the real value. |

## Authentication

| Path | Sample | Purpose |
| --- | --- | --- |
| `auth.altcha.enabled` | `false` | Enables Netuno's server-side ALTCHA checks. Enable this and the website flag together. |
| `auth.jwt.enabled` | `true` | Enables JWT authentication. |
| `auth.jwt.secret` | sample only | JWT signing secret; replace it with a random secret of at least 32 characters. |
| `auth.jwt.expires.access` | `1440` | Access-token lifetime in minutes. |
| `auth.jwt.expires.refresh` | `1440` | Refresh-token lifetime in minutes. |

The local website additionally calls Netuno's platform routes `/_auth`, `/_auth_provider/*`, and `/_altcha`; those routes are not implemented under `server/services` in this repository.

For the complete local service and extension surface, browse `server/services` and `server/core` in this repository.
