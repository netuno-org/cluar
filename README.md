# Netuno CLUAR CMS

A ready to use solution for content management and multilingual websites using [Netuno](https://www.netuno.org/), [ReactJS](https://reactjs.org/) and [Ant Design](https://ant.design/).

## Installation

#### Netuno

[Follow the steps here](https://doc.netuno.org/docs/en/installation/)

#### CLUAR

Create an app with Netuno named `cluar` by running (in the Netuno root directory) 

`./netuno app name=cluar`

and selecting the desired configurations (database type, database name and app language).

Then clone this project to the newly created `(Netuno Root directory)/apps/cluar/` directory.

Then install the NPM dependencies by running 

`npm install` 

in the `cluar/website/` directory.

## Configuration

You'll need to copy the sample service config file by running 

`cp website/src/config/config-dev.json website/src/config/config.json` 

and modifying to match your local environment configuration.

## Running

In the Netuno root directory run

`./netuno server app=cluar`

to start the backend server and then in the `(cluar app directory)/website/` run

`npm run start`

to start the frontend server.
