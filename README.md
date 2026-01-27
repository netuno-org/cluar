![logocluar](https://raw.githubusercontent.com/netuno-org/cluar/main/docs/logo.svg)

# CLUAR CMS 

A ready to use solution for content management and multilingual websites using [Netuno](https://www.netuno.org/), [ReactJS](https://reactjs.org/) and [Ant Design](https://ant.design/).

## Installation :cd:

Install these requirements:
1. [Netuno](https://doc.netuno.org/docs/get-started/installation)
2. [Bun](https://bun.sh/docs/installation)

Then clone this project inside of:

- :open_file_folder: `[Netuno Root directory]/apps` the folder `cluar` must be created.

## Documentation

After the installation and the configuration, see here the developer documentation:

[CLUAR CMS General Developer Documentation](docs/README.md)

## Configuration :wrench:

> The following process is oriented to Linux development environments.

1. Rename the app name by renaming the folder name as you want, only using lowercase letters, numbers, and underscores.

2. Copy the app sample configuration file by running (in the app root directory):
  - `cp config/sample.json config/_development.json` (for a development environment)
  - `cp config/sample.json config/_production.json` (for a production environment)
  - Change the `name` property in the JSON root to your chosen app name.
  - Make all the adjustments according to your environment.

3. You'll need to configure a PostgreSQL database type connection for this app to work properly, [learn how to do it here](https://doc.netuno.org/pt/docs/academy/server/database/psql/).

4. Edit your configuration file created in the first step and
find the `"db": { "default": ... }`, then locate and replace the database settings with the password.

5. Change the authentication JWT secret, finding the `"auth": { "jwt": { "secret": ... } }`, ensure that this secret must have a 32-character length.

6. Inside of the `"settings": { "cluar": ... }` adjust the Website URL, the Services API URL, and others as you need.

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

## Running :rocket:

In the Netuno root directory run

`./netuno server app=cluar`

and it should start both the back-end and the front-end server.

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
