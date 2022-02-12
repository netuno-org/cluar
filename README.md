![Logo](https://raw.githubusercontent.com/netuno-org/cluar/main/docs/logo.svg)

# CLUAR CMS

A ready to use solution for content management and multilingual websites using [Netuno](https://www.netuno.org/), [ReactJS](https://reactjs.org/) and [Ant Design](https://ant.design/).

## Requirement

#### Netuno Platform

[Follow the steps here](https://doc.netuno.org/docs/en/installation/)

## Automatic Application Install

```
./netuno app github=netuno-org/cluar
```

Then load the config.json in the website, example:

```
cp apps/cluar/website/src/config/config-dev.json apps/cluar/website/src/config/config.json
```

> :warning: Inside the `apps/cluar/website/src/config/` folder is needed to copy the `config-dev.json` file to `config.json`.
> 
> Creating the file `config.json` is mandatory to avoid this error:
> 
> `Module not found: Can't resolve '../config/config' in ...`

Start the Netuno Server:

```
./netuno server app=cluar
```

> May take while because is the first time and NPM Install will run to `ui` and `website` folder inside the application root folder.

Is not required, but is recommended to rename the app folder `(Netuno Root directory)/apps/cluar/` to your desired name, and do not forget the `name` parameter in the configurations:

`config/_development.json`

`config/_production.json`

> Remember to start the Netuno Server with your new app name.

## Manual Clone and Setup

Create an app with Netuno named `cluar` by running (in the Netuno root directory) 

`./netuno app name=cluar`

and selecting the desired configurations (database type, database name and app language).

Then clone this project to the newly created `(Netuno Root directory)/apps/cluar/` directory.

Then install the NPM dependencies by running 

`npm install` 

in the `cluar/website/` directory.

## Manual Configuration

You'll need to copy the sample service config file by running 

`cp config/sample.json config/_development.json` (be sure the `name` parameter)

`cp website/src/config/config-dev.json website/src/config/config.json` 

and modifying to match your local environment configuration.

## Running

In the Netuno root directory run

`./netuno server app=cluar`

to start the backend server and then in the `(cluar app directory)/website/` run

`npm run start`

to start the frontend server.
