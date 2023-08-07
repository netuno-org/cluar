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

### Running

Start the Netuno Server:

```
./netuno server app=cluar
```

> May take while because is the first time and NPM Install will run to `ui` and `website` folder inside the application root folder.

:warning: If you got this error:
 
```
 npm ERR! code ERESOLVE
 npm ERR! ERESOLVE unable to resolve dependency tree
```
Then execute the command below inside the `website` folder:

`npm install --force`

:white_check_mark: Is not required, but is recommended to rename the app folder `(Netuno Root directory)/apps/cluar/` to your desired name, and do not forget the `name` parameter in the configurations:

`config/_development.json`

`config/_production.json`

> Remember to restart the Netuno Server with your new app name.

## From Scratch

### Clone and Setup

Create an app with Netuno named `cluar` by running (in the Netuno root directory) 

`./netuno app name=cluar`

and selecting the desired configurations (database type, database name and app language).

Then clone this project to the newly created `(Netuno Root directory)/apps/cluar/` directory.

Then install the NPM dependencies by running 

`npm install --force` 

in the `cluar/website/` directory.

### Configuration

You'll need to copy the sample configuration file by running 

`cp config/sample.json config/_development.json` (be sure the `name` parameter)

and modifying to match your local environment configuration.

### Running

In the Netuno root directory run

`./netuno server app=cluar`

to start the backend server and then in the `(cluar app directory)/website/` run

`npm run dev`

to start the frontend server.
