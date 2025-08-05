![logocluar](https://raw.githubusercontent.com/netuno-org/cluar/main/docs/logo.svg)

# CLUAR CMS 
A ready to use solution for content management and multilingual websites using [Netuno](https://www.netuno.org/), [ReactJS](https://reactjs.org/) and [Ant Design](https://ant.design/).

## Installation :cd:

**Netuno**

[Follow the steps here](https://doc.netuno.org/docs/get-started/installation)

**Bun**

[Follow the steps here](https://bun.sh/docs/installation)

**Cluar App**

Clone this project to `(Netuno Root directory)/apps/cluar/`.

## Documentation

[CLUAR CMS General Documentation](docs/README.md)

## Configuration :wrench:

> The following process is oriented to Linux development environments.

1. Copy the app sample configuration file by running (in the app root directory):
    - `cp config/sample.json config/_development.json` (for a development environment)
    - `cp config/sample.json config/_production.json` (for a production environment)
    - and adjust the `_development.json` and/or `_production.json` file accordingly to your environment.
  
2. You'll need to configure a PostgreSQL database type connection for this app to work properly, [learn how to do it here](https://doc.netuno.org/pt/docs/academy/server/database/psql/).

3. Locate and replace the word `S3cR3t` by a secret code, as random as possible, since this is what ensures the security of users' credentials. For example: `#J&Az+7(8d+k/9q]` . [Recommended Secure Code Generation tool](https://www.random.org/passwords/).

### JWT Configuration:
4. Make sure the following `_development.json` parameters match the example:

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
                    "google": false
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

 - add the `auth` parameter after the closing `settings` parameter brace:
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
> In the "jwt" key, fill in according to your preference. It is recommended to use a random password generator: [Recommended Secure Code Generation tool](https://www.random.org/passwords/).

5. in the directory `website/` run the command `npm install --force`.

6. You'll also need to configure the website sample config file located in `website/src/config/`:
    - Change the configurations inside `_development_config.json` and `_production_config.json` for development and production environments respectively.
      

## Running :rocket:

In the Netuno root directory run

`./netuno server app=cluar`

and it should start both the back-end and the front-end server.

> The first run may take a while due to the installation of frontend dependencies.

By default, the Netuno back office will be available in:
  - [http://localhost:9000/](http://localhost:9000/)

The OpenAPI will be in:
  - [http://localhost:9000/services/_openapi](http://localhost:9000/services/_openapi)

And the front-end (restricted website) will start in:
  - [http://localhost:3000/](http://localhost:3000/)
