# CLUAR CMS

A ready to use solution for content management and multilingual websites using [Netuno](https://www.netuno.org/), [ReactJS](https://reactjs.org/) and [Ant Design](https://ant.design/).

## Requirement

#### Netuno Platform

[Follow the steps here](https://doc.netuno.org/docs/en/installation/)

## Automatic Application Install

```
./netuno app github=netuno-org/cluar
```

Then rename the app folder `(Netuno Root directory)/apps/cluar/` to your desired name, and do not forget the `name` parameter in the configurations:

`config/_development.json`

`config/_production.json`

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
