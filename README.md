![logocluar](https://raw.githubusercontent.com/netuno-org/cluar/main/docs/logo.svg)

# CLUAR CMS 

A ready to use solution for content management and multilingual websites using [Netuno](https://www.netuno.org/), [ReactJS](https://reactjs.org/) and [Ant Design](https://ant.design/).

## Installation :cd:

Install these requirements:
1. [Netuno](https://doc.netuno.org/docs/get-started/installation)
2. [Bun](https://bun.sh/docs/installation)
3. [PNPM](https://pnpm.io/installation)

Then clone this project inside of:

- :open_file_folder: `[Netuno Root directory]/apps/cluar`

## Documentation

After the installation and the configuration, see here the developer documentation:

[CLUAR CMS General Developer Documentation](docs/README.md)

## Configuration :wrench:

> The following process is oriented to Linux development environments.

1. Copy the app sample configuration file by running (in the app root directory):

- `cp config/sample.json config/_development.json` (for a development environment)
- `cp config/sample.json config/_production.json` (for a production environment)
- Make all the adjustments accordingly of your environment.
  
2. You'll need to configure a PostgreSQL database type connection for this app to work properly, [learn how to do it here](https://doc.netuno.org/pt/docs/academy/server/database/psql/).

3. Edit your configuration file created in the first step and
find the `"db": { "default": ... }`, then locate and replace the database settings as the password.

4. Change the authentication JWT secret finding the `"auth": { "jwt": { "secret": ... } }`, ensure that this secret must have 32 characteres length.

5. Inside of the `"settings": { "cluar": ... }` adjust the Website URL and the Services API URL and others as you need.

## Website with PNPM and Bun :art:

Inside the website folder:

```
cd website
```

Execute the PNPM install command:

```
pnpm install
```

If a **Warning box** appears, then execute:

```
pnpm approve-builds
```

> Choose all by pressing the key `a` and then the `[ENTER]` key to finish.

To restart the website installation, remove this folder and these files:

```
rm -rf node_modules
rm -f pnpm-*
```

Now you can start the website with the classic command:

```pnpm run dev```

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
pnpm run dev
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
