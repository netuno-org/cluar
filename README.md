![logocluar](https://raw.githubusercontent.com/netuno-org/cluar/main/docs/logo.svg)

# CLUAR CMS 

A ready to use solution for content management and multilingual websites using [Netuno](https://www.netuno.org/), [ReactJS](https://reactjs.org/) and [Ant Design](https://ant.design/).

## Documentation :books:

The full CLUAR documentation — installation, configuration, pages, components, actions, settings, dictionaries, templates and permissions — is available in the [Netuno Academy](https://doc.netuno.org/docs/academy/cluar/overview).

Repository-level configuration is documented in the [complete configuration reference](docs/configuration-reference.md).

## Installation :cd:

Install these requirements:
1. [Netuno](https://doc.netuno.org/docs/get-started/installation)
2. [Bun](https://bun.sh/docs/installation)

Then clone this project inside of:

- :open_file_folder: `[Netuno Root directory]/apps`

Using the clone command:

```
git clone https://github.com/netuno-org/cluar.git
```

## Configuration :wrench:

> The following process is oriented to Linux development environments.

1. Rename the app name by renaming the folder name as you want, only using lowercase letters, numbers, and underscores.

2. Copy the app sample configuration file by running (in the app root directory):
  - `cp config/sample.json config/_development.json` (for a development environment)
  - `cp config/sample.json config/_production.json` (for a production environment)
  - Change the `name` property in the JSON root to your chosen app name.
  - Make all the adjustments according to your environment.

3. You'll need to configure a PostgreSQL database type connection for this app to work properly, [learn how to do it here](https://doc.netuno.org/docs/academy/server/database/psql/).

4. Edit the configuration file created in the previous step and
find the `"db": { "default": ... }`, then locate and replace the database settings with the password.

5. Change the authentication JWT secret, finding the `"auth": { "jwt": { "secret": ... } }`, ensure that this secret must have a 32-character length.

6. If needed, enable [Altcha](https://altcha.org/) (a privacy-friendly alternative to reCAPTCHA) by setting `"auth": { "altcha": { "enabled": true } }` for server-side validation and `"settings": { "cluar": { "website": { "auth": { "altcha": true } } } }` for the widget to appear on the website.

7. Inside of the `"settings": { "cluar": ... }` adjust the Website URL, the Services API URL, and others as you need.

## Website with Bun :art:

Inside the website folder:

```
cd website
```

Execute the Bun install command:

```
bun install
```

It needs to execute untrusted scripts of the ESBUILD, then execute:

```
bun pm trust --all
```

If needed, to restart the website installation, remove this folder and these files:

```
rm -rf node_modules
bun install
bun pm trust --all
```

Now you can start the website with the classic command:

```bun run dev```

> By default, the website runs with Bun.

## Troubleshooting :hammer_and_wrench:

### GLIBC version error when running `bun run dev`

If you get an error like this when starting the website:

```
Error: Cannot find module @rollup/rollup-linux-x64-gnu. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory.
...
[cause]: Error: /lib/x86_64-linux-gnu/libc.so.6: version `GLIBC_2.32' not found (required by .../node_modules/@rollup/rollup-linux-x64-gnu/rollup.linux-x64-gnu.node)
code: 'ERR_DLOPEN_FAILED'
```

This is **not** actually the npm optional dependencies bug mentioned in the message. It's a **GLIBC version mismatch**: Rollup's native binary was built requiring `GLIBC_2.32` or newer, while older Linux distributions (e.g. Ubuntu 20.04, which ships with glibc 2.31) don't have it available.

The website's `package.json` already forces Rollup to use its WASM build instead of the native one. Verify that this `overrides` field is still present:

```json
"overrides": {
  "rollup": "npm:@rollup/wasm-node"
}
```

Then reinstall the dependencies:

```
rm -rf node_modules bun.lock bun.lockb
bun install
bun pm trust --all
bun run dev
```

## Running :rocket:

In the Netuno root directory run:

`./netuno server app=<app-name>`

> If the app name was not changed, use `cluar` as the app name.

Replace `<app-name>` with the folder/configuration name chosen above. The command starts the back-end and, when the website command is enabled in the app configuration, the front-end server.

> The first run may take a while due to the installation of frontend dependencies.

By default, the Netuno backoffice will be available in:
  - [http://localhost:9000/](http://localhost:9000/)

The OpenAPI will be in:
  - [http://localhost:9000/services/_openapi](http://localhost:9000/services/_openapi)

To start the website:

```
cd website
bun run dev
```

By default, the website is available in:
  - [http://localhost:3000/](http://localhost:3000/)

You can auto-start the website with the Netuno server, enabling the command in the `config/_development.json`:

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
